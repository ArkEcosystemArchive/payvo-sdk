import "jest-extended";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32 } from "@payvo/cryptography";
import assert from "assert";

const network = bitcoin.networks.testnet;

const mnemonic1 = "hard produce blood mosquito provide feed open enough access motor chimney swamp";
const mnemonic2 = "build tuition fuel distance often swallow birth embark nest barely drink beach";
const mnemonic3 = "mandate pull cat east limit enemy cabin possible success force mountain hood";

const key1 = BIP32.fromMnemonic(mnemonic1, network); // Master pub key Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN
// for ps2h-segwit: Upub5T4iARd31HKU9kp1bZPe6amDxNWyb79scrVhhaFf5CEVrUo63aHGgkgR6TPhhNpqWqaTHvbwbEyUJNAHXomgNa7Ht5RUEQ9BpJNiQxoX7hr

const key2 = BIP32.fromMnemonic(mnemonic2, network);
const key3 = BIP32.fromMnemonic(mnemonic3, network);

const sort = (a: Buffer, b: Buffer) => Buffer.compare(a, b);

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

	it("should create a legacy multisig wallet like Electrum", async () => {
		const createLegacyAddress = (pubkeys: bitcoin.BIP32Interface[], isSpend: boolean, addressIndex: number) =>
			bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2ms({
					m: 2,
					pubkeys: pubkeys.map((pk) => pk.derive(isSpend ? 0 : 1).derive(addressIndex).publicKey).sort(sort),
					network,
				}),
				network,
			});

		const baseKeys = [
			key1.deriveHardened(45).derive(0),
			key2.deriveHardened(45).derive(0),
			key3.deriveHardened(45).derive(0),
		];

		expect(createLegacyAddress(baseKeys, true, 0).address).toBe("2Mzq2GgWGQShdNr7H2hCxvC6pGrqzb64R3k");
		expect(createLegacyAddress(baseKeys, true, 1).address).toBe("2NAga16irQ8iaMEU3db3k7ZTmg7eaGSpzvy");
		expect(createLegacyAddress(baseKeys, true, 2).address).toBe("2MzLoh1jz3QJ8DARk99NuQvy2Mfg954J4HE");

		expect(createLegacyAddress(baseKeys, false, 0).address).toBe("2N5ETorn5JyFdWYYnAb9PVC3Hz1bgMjWQPU");
		expect(createLegacyAddress(baseKeys, false, 1).address).toBe("2N5WAJtL3hhc9TwNJp6JjSNeUhg16o4D9T3");
		expect(createLegacyAddress(baseKeys, false, 2).address).toBe("2MufXVhLZfhQSBgVaghCMdHvPZjWxCZBnSx");
	});

	it("should create a p2sh-segwit (p2wsh-p2sh) multisig wallet like Electrum", async () => {
		const createP2SHSegwitAddress = (pubkeys: bitcoin.BIP32Interface[], isSpend: boolean, addressIndex: number) =>
			bitcoin.payments.p2sh({
				redeem: bitcoin.payments.p2wsh({
					redeem: bitcoin.payments.p2ms({
						m: 2,
						pubkeys: pubkeys.map((pk) => pk.derive(isSpend ? 0 : 1).derive(addressIndex).publicKey).sort(sort),
						network,
					}),
					network,
				}),
				network,
			});

		const baseKeys = [
			key1.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(1),
			key2.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(1),
			key3.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(1),
		];

		expect(createP2SHSegwitAddress(baseKeys, true, 0).address).toBe("2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT");
		expect(createP2SHSegwitAddress(baseKeys, true, 1).address).toBe("2MtQ9HwWz8wvax9YNLo3S35tcGWZMYTWW1B");
		expect(createP2SHSegwitAddress(baseKeys, true, 2).address).toBe("2N9kwKrsHVgnTuTiTSqVoXoxk4nUGKSscey");

		expect(createP2SHSegwitAddress(baseKeys, false, 0).address).toBe("2N3WVdraaxhMKizN2EQ4p6QaZupBXs6dnBp");
		expect(createP2SHSegwitAddress(baseKeys, false, 1).address).toBe("2N9iWAxKvU7PF4nKqFX1j57f1rxFXoaVW8Q");
		expect(createP2SHSegwitAddress(baseKeys, false, 2).address).toBe("2N1WTeWAJmMmsRL4VFnTEtL6jphUEPTJSvB");
	});

	it("should create a native segwit (p2wsh) multisig wallet like Electrum", async () => {
		const createNativeSegwitAddress = (pubkeys: bitcoin.BIP32Interface[], isSpend: boolean, addressIndex: number) =>
			bitcoin.payments.p2wsh({
				redeem: bitcoin.payments.p2ms({
					m: 2,
					pubkeys: pubkeys.map((pk) => pk.derive(isSpend ? 0 : 1).derive(addressIndex).publicKey).sort(sort),
					network,
				}),
				network,
			});

		const baseKeys = [
			key1.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(2),
			key2.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(2),
			key3.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(2),
		];

		expect(createNativeSegwitAddress(baseKeys, true, 0).address).toBe(
			"tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965",
		);
		expect(createNativeSegwitAddress(baseKeys, true, 1).address).toBe(
			"tb1qq57mp9ygm7d6ps9mzgelzwj806dfszw4paqzmuds8n24q9eacspq4t20kv",
		);
		expect(createNativeSegwitAddress(baseKeys, true, 2).address).toBe(
			"tb1qu74mke55g3645qz2phgvej24k4qpmq33mkywyn5yyqknh7lcag5qapfmxv",
		);

		expect(createNativeSegwitAddress(baseKeys, false, 0).address).toBe(
			"tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2",
		);
		expect(createNativeSegwitAddress(baseKeys, false, 1).address).toBe(
			"tb1q9dpf5gjwgwmdftn22tfmq4cmw3qt825nf3xgd4wkdg3ktw6z2shsa5wauj",
		);
		expect(createNativeSegwitAddress(baseKeys, false, 2).address).toBe(
			"tb1qlj3qkv9c5j5gfqgfnqjl0nkwuvw8ktq9u3ahg0du4jnde852nrcstf4cka",
		);
	});

	it("should create a transfer from multisig wallet", async () => {
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
				address: "tb1qq57mp9ygm7d6ps9mzgelzwj806dfszw4paqzmuds8n24q9eacspq4t20kv",
				value: 49800,
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
			"02000000000101b1e1c5155e2d77c3f988fa71535541402dcf607008f4ec418bc3e2f285e95ac10100000000ffffffff0188c2000000000000220020053db09488df9ba0c0bb1233f13a477e9a9809d50f402df1b03cd550173dc402040047304402206962f25957d8e9158f2f64ebc9eb08a9da8b2d2647f7a774acef346ac9e31c5d02207709ffe752021a1e80c18177c05a187e6889a1255345ca1de4fd4a226473517d014830450221008645bc7a1fe784b625eab355e0b71b2dd8c406d47d4969e10b1452adbdfd217e02204fae17d13c8ccdf86655dd05b1e55760aa51f6e0b052dd064d409730113129400169522103b1cc688497fc27a3033d5847da462bd9f6768e0e1c18e55cd28cc49f46e0749e21028c7f430d99b1bd5920f8f83fc8c1a613b52222c8d40806a5c086eb63af65788f2103b7141fab4a4094f596ed111e81a1b48d5f30ad0d5f1896959c61e6235cbac1e653ae00000000",
		);
	});
});
