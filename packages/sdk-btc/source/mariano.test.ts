import "jest-extended";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32 } from "@payvo/cryptography";
import assert from "assert";

const network = bitcoin.networks.testnet;

const mnemonic1 = "hard produce blood mosquito provide feed open enough access motor chimney swamp";
const mnemonic2 = "build tuition fuel distance often swallow birth embark nest barely drink beach";
const mnemonic3 = "mandate pull cat east limit enemy cabin possible success force mountain hood";

const key1 = BIP32.fromMnemonic(mnemonic1, network);
const key2 = BIP32.fromMnemonic(mnemonic2, network);
const key3 = BIP32.fromMnemonic(mnemonic3, network);

// jest.setTimeout(60_000);

describe("multi signature", () => {
	it("should create musig wallet", async () => {
		const pubkeys = [key1.publicKey, key2.publicKey, key3.publicKey];
		console.log(pubkeys.map((pk) => pk.toString("hex")));
		const { address } = bitcoin.payments.p2wsh({
			redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network }),
			network,
		});

		expect(address).toBe("tb1q3gu8yjqmjxfzg79vp3ez8dfmzxelf4z6ra42vwv0fnm02z6y6yyqdncskq");
	});

	it("should create a transfer from musig wallet", async () => {
		const pubkeys = [key1.publicKey, key2.publicKey, key3.publicKey];

		const utxo = {
			address: "tb1q3gu8yjqmjxfzg79vp3ez8dfmzxelf4z6ra42vwv0fnm02z6y6yyqdncskq",
			txId: "c15ae985f2e2c38b41ecf4087060cf2d4041555371fa88f9c3772d5e15c5e1b1",
			outputIndex: 1,
			script: "00208a3872481b91922478ac0c7223b53b11b3f4d45a1f6aa6398f4cf6f50b44d108",
			satoshis: 50000,
		};
		const payment = bitcoin.payments.p2wsh({
			redeem: bitcoin.payments.p2ms({ m: 2, pubkeys, network }),
			network,
		});

		const psbt = new bitcoin.Psbt({ network })
			.addInput({
				hash: utxo.txId,
				index: utxo.outputIndex,
				witnessUtxo: {
					script: Buffer.from(utxo.script, "hex"),
					value: 50000,
				},
				witnessScript: payment.redeem?.output,
			})
			.addOutput({
				address: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
				value: 45000,
			})
			.addOutput({
				address: "tb1q3gu8yjqmjxfzg79vp3ez8dfmzxelf4z6ra42vwv0fnm02z6y6yyqdncskq",
				value: 4600,
			});

		// TODO We should probably sign it before distribution by the party initiating the transfer

		// encode to send out to the signers
		const psbtBaseText = psbt.toBase64();

		// each signer imports
		const signer1 = bitcoin.Psbt.fromBase64(psbtBaseText);
		const signer2 = bitcoin.Psbt.fromBase64(psbtBaseText);
		const signer3 = bitcoin.Psbt.fromBase64(psbtBaseText);

		// Alice signs each input with the respective private keys
		// signInput and signInputAsync are better
		// (They take the input index explicitly as the first arg)
		signer1.signAllInputs(key1);
		signer2.signAllInputs(key2);
		signer3.signAllInputs(key3);

		// encode to send back to combiner (signer 1 and 2 are not near each other)
		const s1text = signer1.toBase64();
		const s2text = signer2.toBase64();
		const s3text = signer3.toBase64();

		const final1 = bitcoin.Psbt.fromBase64(s1text);
		const final2 = bitcoin.Psbt.fromBase64(s2text);
		const final3 = bitcoin.Psbt.fromBase64(s3text);

		// final1.combine(final2) would give the exact same result
		psbt.combine(final1, final3);

		// Finalizer wants to check all signatures are valid before finalizing.
		// If the finalizer wants to check for specific pubkeys, the second arg
		// can be passed. See the first multisig example below.
		assert.strictEqual(psbt.validateSignaturesOfInput(0), true);

		// This step it new. Since we separate the signing operation and
		// the creation of the scriptSig and witness stack, we are able to
		psbt.finalizeAllInputs();

		// build and check
		expect(psbt.extractTransaction().toHex()).toBe(
			"02000000000101b1e1c5155e2d77c3f988fa71535541402dcf607008f4ec418bc3e2f285e95ac10100000000ffffffff02c8af000000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac4f8110000000000002200208a3872481b91922478ac0c7223b53b11b3f4d45a1f6aa6398f4cf6f50b44d10804004830450221009050f060942523a180b90cd6f6116496b483a32a39c6d7251ea83d91bf55a128022048af6510a2c66e7e8800be3372d9dd2777b2df768bb1ea2f328cb2ed684e478201483045022100a3f5a97174f397075dfffe94a1543a4d776c8069967a472fd369d083d05e2321022036a226eafdcb8832e7ae4bd08cfabafb93079593fd421dc055138ad2e84d2d8e0169522103b1cc688497fc27a3033d5847da462bd9f6768e0e1c18e55cd28cc49f46e0749e21028c7f430d99b1bd5920f8f83fc8c1a613b52222c8d40806a5c086eb63af65788f2103b7141fab4a4094f596ed111e81a1b48d5f30ad0d5f1896959c61e6235cbac1e653ae00000000",
		);
	});
});
