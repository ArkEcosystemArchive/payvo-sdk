import "jest-extended";
import * as bitcoin from "bitcoinjs-lib";
import { BIP32 } from "@payvo/cryptography";
import assert from "assert";

const network = bitcoin.networks.testnet;

const mnemonic1 = "hard produce blood mosquito provide feed open enough access motor chimney swamp";
const mnemonic2 = "build tuition fuel distance often swallow birth embark nest barely drink beach";
const mnemonic3 = "mandate pull cat east limit enemy cabin possible success force mountain hood";

const key1 = BIP32.fromMnemonic(mnemonic1, network);
// Master pub key Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN

const key2 = BIP32.fromMnemonic(mnemonic2, network);
// Master pub key Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1

const key3 = BIP32.fromMnemonic(mnemonic3, network);
// Master pub key Vpub5mSSLBPFi3acdjk5giwrmA7gXPAJsiLXXKibgjXYycH1gp95t2Pqv3U8dT9kEGxvAdfiN5DGmozDmZ7sJyDuMgfxt4h4KujF7MWt5tQH8py

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
						pubkeys: pubkeys
							.map((pk) => pk.derive(isSpend ? 0 : 1).derive(addressIndex).publicKey)
							.sort(sort),
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

	const createNativeSegwitAddress = (pubkeys: bitcoin.BIP32Interface[], isSpend: boolean, addressIndex: number) =>
		bitcoin.payments.p2wsh({
			redeem: bitcoin.payments.p2ms({
				m: 2,
				pubkeys: pubkeys.map((pk) => pk.derive(isSpend ? 0 : 1).derive(addressIndex).publicKey).sort(sort),
				network,
			}),
			network,
		});

	it("should create a native segwit (p2wsh) multisig wallet like Electrum", async () => {
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
		const baseKeys = [
			key1.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(2),
			key2.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(2),
			key3.deriveHardened(48).deriveHardened(1).deriveHardened(0).deriveHardened(2),
		];

		const utxo = {
			address: "tb1qzdtkhgwyqnufeuc3tq88d74plcagcryzmfwclyadxgj90kwvhpps0gu965",
			txId: "7b063a6a6456a481d93e161f430aba62aa05a16e19c0a1897dd8c6cd99dad306",
			outputIndex: 1,
			script: "002013576ba1c404f89cf311580e76faa1fe3a8c0c82da5d8f93ad322457d9ccb843",
			satoshis: 0.001,
		};
		const payment = createNativeSegwitAddress(baseKeys, true, 0);

		const psbt = new bitcoin.Psbt({ network })
			.addInput({
				hash: utxo.txId,
				index: utxo.outputIndex,
				witnessUtxo: {
					script: Buffer.from(utxo.script, "hex"),
					value: 100000,
				},
				witnessScript: payment.redeem?.output,
			})
			.addOutput({
				address: "2Mv8e5hWoFh9X8YdU4e4qCAv7m4wBCz2ytT",
				value: 98800,
			})
			.addOutput({
				address: "tb1qsyz35zpeueuwmcjap75flg93mny2gn7v3urnnwe4k05rcnvnp4cqq7hew2",
				value: 200,
			});

		// TODO We should probably sign it before distribution by the party initiating the transfer

		// encode to send out to the signers
		const psbtBaseText = psbt.toBase64();

		// each signer imports
		const signer1 = bitcoin.Psbt.fromBase64(psbtBaseText);
		const signer2 = bitcoin.Psbt.fromBase64(psbtBaseText);
		const signer3 = bitcoin.Psbt.fromBase64(psbtBaseText);

		// (They take the input index explicitly as the first arg)
		signer1.signAllInputs(baseKeys[0].derive(0).derive(0));
		signer2.signAllInputs(baseKeys[1].derive(0).derive(0));
		signer3.signAllInputs(baseKeys[2].derive(0).derive(0));

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
			"0200000000010106d3da99cdc6d87d89a1c0196ea105aa62ba0a431f163ed981a456646a3a067b0100000000ffffffff02f08101000000000017a9141fa993e76d714a6b603abea2361c20c0c7f003bb87c80000000000000022002081051a0839e678ede25d0fa89fa0b1dcc8a44fcc8f0739bb35b3e83c4d930d700400483045022100cdbd7729f8a25152e2eef2e4a737240dd553165c62370c12b9ee85f67c0c512302203a69e1285e21aff88f75ed144fe90a1bd1a826c9b2f042b9360ffdf54c33055b0147304402205150444107b40c102ae1455fe7099653216de2eba83009105722e5d879e2be9602200443f5866804005e0f37dcf7b343ad56c137b9c49eaaf19e54b5c52a5561b6ca016952210314e9ec814e8f5c7e7b16e17a0a8a65efea64c88f01085aaed41ebac7df9bf6e121032b0996a84fb0449a899616ca746c8e6cfc5d8f823114ba6bd7aed5b4e90442e221033830fa105ee889ae98074506e9d5f1153aafa64fa828904843204564f95a492653ae00000000",
		);
	});
});
