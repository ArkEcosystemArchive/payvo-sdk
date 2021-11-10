import "jest-extended";

import nock from "nock";
import { nativeSegwitMusig, rootKeyToAccountKey } from "../source/address.domain";
import { BIP32 } from "@payvo/cryptography";
import * as bitcoin from "bitcoinjs-lib";
import { musig } from "./fixtures/musig";
import { convertString } from "@payvo/helpers";

beforeEach(async () => {
	nock.disableNetConnect();
});

const network = bitcoin.networks.testnet;

describe("example code using bitcoinjs-lib", () => {
	const rootKeys = musig.accounts.map((account) => BIP32.fromMnemonic(account.mnemonic, network));

	const accountKeys = rootKeys.map((rootKey) => rootKeyToAccountKey(rootKey, "48'/1'/0'/2'"));
	const neuturedAccountKeys = accountKeys.map((key) => key.neutered());

	it("should create and sign a transfer from multisig wallet", async () => {
		const network = bitcoin.networks.testnet;

		const utxo = {
			address: "tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965",
			txId: "7b063a6a6456a481d93e161f430aba62aa05a16e19c0a1897dd8c6cd99dad306",
			outputIndex: 1,
			script: "002013576ba1c404f89cf311580e76faa1fe3a8c0c82da5d8f93ad322457d9ccb843",
			satoshis: 0.001,
			raw: "0200000000010151a318ad4988b5e06a3c0fb11e8d9129b61d98e45371e97cd6f9f65bce5ac0390000000000feffffff02f2af7d000000000016001436fa62017ceebfa965db95439de7d5836da3a455a08601000000000022002013576ba1c404f89cf311580e76faa1fe3a8c0c82da5d8f93ad322457d9ccb8430247304402200fe3735f0568a31bfab11bfb0a8fc2092adc9661a728dc0d10f512d7ea0e344c022070ee8da34ae319e56d23712be025ca393f9152fa480c9fe61b0465574c61889d01210205ceaaf413c3a10a1e5bcd50bdaa44b21b7bfbb5ee4c10d8ea89b2b043f2493bd2fe1f00",
		};

		const payment = nativeSegwitMusig(
			2,
			neuturedAccountKeys.map((pk) => pk.derivePath("0/0").publicKey),
			network,
		);

		const psbt = new bitcoin.Psbt({ network })
			.addInput({
				hash: utxo.txId,
				index: utxo.outputIndex,
				witnessUtxo: {
					script: Buffer.from(utxo.script, "hex"),
					value: utxo.satoshis * 10e8,
				},
				witnessScript: payment.redeem?.output,
				bip32Derivation: neuturedAccountKeys.map((pubKey, index) => ({
					// bitcoinjs-lib expects to have root level fingerprints, can't use account level
					masterFingerprint: rootKeys[index].fingerprint,
					// bitcoinjs-lib expects full path, relative paths are incorrectly serialized / deserialized
					path: "m/48'/1'/0'/2'/0/0",
					pubkey: pubKey.derivePath("0/0").publicKey,
				})),
				nonWitnessUtxo: convertString(utxo.raw),
			})
			.addOutput({
				address: "2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT",
				value: 98800,
			})
			.addOutput({
				// Change address m/48'/1'/0'/2'/1/0
				address: "tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2",
				value: 200,
				bip32Derivation: neuturedAccountKeys.map((pubKey, index) => ({
					masterFingerprint: rootKeys[index].fingerprint,
					path: "m/48'/1'/0'/2'/1/0",
					pubkey: pubKey.derivePath("1/0").publicKey,
				})),
			});

		// encode to send out to the signers
		const psbtBaseText = psbt.toBase64();

		// each signer imports the unsigned transaction
		const signer1 = bitcoin.Psbt.fromBase64(psbtBaseText);
		const signer2 = bitcoin.Psbt.fromBase64(psbtBaseText);
		// const signer3 = bitcoin.Psbt.fromBase64(psbtBaseText);

		// (They take the input index explicitly as the first arg)
		signer1.signAllInputsHD(rootKeys[0]);
		signer2.signAllInputsHD(rootKeys[1]);
		// signer3.signAllInputsHD(rootKeys[2]);

		// encode to send back to combiner (signer 1 and 2 are not near each other)
		const s1text = signer1.toBase64();
		const s2text = signer2.toBase64();
		// const s3text = signer3.toBase64();

		const final1 = bitcoin.Psbt.fromBase64(s1text);
		const final2 = bitcoin.Psbt.fromBase64(s2text);
		// const final3 = bitcoin.Psbt.fromBase64(s3text);

		// No need to sign by signer3, as it a 2-of-3 account
		psbt.combine(final1, final2);

		// Finalizer needs to check all signatures are valid before finalizing.
		expect(psbt.validateSignaturesOfInput(0)).toBeTrue();
		expect(psbt.validateSignaturesOfAllInputs()).toBeTrue();

		// Finilizing creates the scriptSig and witness stack
		psbt.finalizeAllInputs();

		// Build and check the hex
		expect(psbt.extractTransaction().toHex()).toBe(
			"0200000000010106d3da99cdc6d87d89a1c0196ea105aa62ba0a431f163ed981a456646a3a067b0100000000ffffffff02f08101000000000017a9141fa993e76d714a6b603abea2361c20c0c7f003bb87c80000000000000022002081051a0839e678ede25d0fa89fa0b1dcc8a44fcc8f0739bb35b3e83c4d930d700400473044022021bebb78ceb2fa6710e7eca289277f5d35e1d7822218cab21d0505194e47ac920220252dcac4356c7180fe46ecc0b101fb67e38f12009a07f1ba6de952be24017f120147304402205150444107b40c102ae1455fe7099653216de2eba83009105722e5d879e2be9602200443f5866804005e0f37dcf7b343ad56c137b9c49eaaf19e54b5c52a5561b6ca016952210314e9ec814e8f5c7e7b16e17a0a8a65efea64c88f01085aaed41ebac7df9bf6e121032b0996a84fb0449a899616ca746c8e6cfc5d8f823114ba6bd7aed5b4e90442e221033830fa105ee889ae98074506e9d5f1153aafa64fa828904843204564f95a492653ae00000000",
		);
	});

	it("should create and sign a transfer from multisig wallet without using fingerprints", async () => {
		const network = bitcoin.networks.testnet;

		const utxo = {
			address: "tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965",
			txId: "7b063a6a6456a481d93e161f430aba62aa05a16e19c0a1897dd8c6cd99dad306",
			outputIndex: 1,
			script: "002013576ba1c404f89cf311580e76faa1fe3a8c0c82da5d8f93ad322457d9ccb843",
			satoshis: 0.001,
			raw: "0200000000010151a318ad4988b5e06a3c0fb11e8d9129b61d98e45371e97cd6f9f65bce5ac0390000000000feffffff02f2af7d000000000016001436fa62017ceebfa965db95439de7d5836da3a455a08601000000000022002013576ba1c404f89cf311580e76faa1fe3a8c0c82da5d8f93ad322457d9ccb8430247304402200fe3735f0568a31bfab11bfb0a8fc2092adc9661a728dc0d10f512d7ea0e344c022070ee8da34ae319e56d23712be025ca393f9152fa480c9fe61b0465574c61889d01210205ceaaf413c3a10a1e5bcd50bdaa44b21b7bfbb5ee4c10d8ea89b2b043f2493bd2fe1f00",
		};

		const payment = nativeSegwitMusig(
			2,
			neuturedAccountKeys.map((pk) => pk.derivePath("0/0").publicKey),
			network,
		);

		const psbt = new bitcoin.Psbt({ network })
			.addInput({
				hash: utxo.txId,
				index: utxo.outputIndex,
				witnessUtxo: {
					script: Buffer.from(utxo.script, "hex"),
					value: utxo.satoshis * 10e8,
				},
				witnessScript: payment.redeem?.output,
				nonWitnessUtxo: convertString(utxo.raw),
			})
			.addOutput({
				address: "2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT",
				value: 98800,
			})
			.addOutput({
				// Change address m/48'/1'/0'/2'/1/0
				address: "tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2",
				value: 200,
			});

		// encode to send out to the signers
		const psbtBaseText = psbt.toBase64();

		// each signer imports the unsigned transaction
		const signer1 = bitcoin.Psbt.fromBase64(psbtBaseText);
		const signer2 = bitcoin.Psbt.fromBase64(psbtBaseText);
		// const signer3 = bitcoin.Psbt.fromBase64(psbtBaseText);

		// (They take the input index explicitly as the first arg)
		signer1.signInput(0, rootKeys[0].derivePath("48'/1'/0'/2'/0/0")); // The trick here is figuring out the path (last two bits)
		signer2.signInput(0, rootKeys[1].derivePath("48'/1'/0'/2'/0/0"));
		// signer3.signInput(0, rootKeys[2].derivePath("48'/1'/0'/2'/0/0"));

		// encode to send back to combiner (signer 1 and 2 are not near each other)
		const s1text = signer1.toBase64();
		const s2text = signer2.toBase64();
		// const s3text = signer3.toBase64();

		const final1 = bitcoin.Psbt.fromBase64(s1text);
		const final2 = bitcoin.Psbt.fromBase64(s2text);
		// const final3 = bitcoin.Psbt.fromBase64(s3text);

		// No need to sign by signer3, as it a 2-of-3 account
		psbt.combine(final1, final2);

		// Finalizer needs to check all signatures are valid before finalizing.
		expect(psbt.validateSignaturesOfInput(0)).toBeTrue();
		expect(psbt.validateSignaturesOfAllInputs()).toBeTrue();

		// Finilizing creates the scriptSig and witness stack
		psbt.finalizeAllInputs();

		// Build and check the hex
		expect(psbt.extractTransaction().toHex()).toBe(
			"0200000000010106d3da99cdc6d87d89a1c0196ea105aa62ba0a431f163ed981a456646a3a067b0100000000ffffffff02f08101000000000017a9141fa993e76d714a6b603abea2361c20c0c7f003bb87c80000000000000022002081051a0839e678ede25d0fa89fa0b1dcc8a44fcc8f0739bb35b3e83c4d930d700400473044022021bebb78ceb2fa6710e7eca289277f5d35e1d7822218cab21d0505194e47ac920220252dcac4356c7180fe46ecc0b101fb67e38f12009a07f1ba6de952be24017f120147304402205150444107b40c102ae1455fe7099653216de2eba83009105722e5d879e2be9602200443f5866804005e0f37dcf7b343ad56c137b9c49eaaf19e54b5c52a5561b6ca016952210314e9ec814e8f5c7e7b16e17a0a8a65efea64c88f01085aaed41ebac7df9bf6e121032b0996a84fb0449a899616ca746c8e6cfc5d8f823114ba6bd7aed5b4e90442e221033830fa105ee889ae98074506e9d5f1153aafa64fa828904843204564f95a492653ae00000000",
		);
	});
});
