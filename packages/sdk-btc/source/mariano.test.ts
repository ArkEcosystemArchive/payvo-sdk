import "jest-extended";
import * as bitcoin from "bitcoinjs-lib";

import { IoC, Services } from "@payvo/sdk";
import BtcApp from "@ledgerhq/hw-app-btc";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-singleton";
import { jest } from "@jest/globals";

import { ledger } from "../test/fixtures/ledger";
import { createService } from "../test/mocking";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";

import { BIP39 as bip39 } from "@payvo/cryptography";

import { serializeTransaction as serializer } from "@ledgerhq/hw-app-btc/lib/serializeTransaction";

jest.setTimeout(20_000);

const createMockService = async (record: string) => {
	logger.listen((log) => console.info(log.type + ": " + log.message));

	const transport = await createService(LedgerService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
	});

	// @ts-ignore
	await transport.connect(TransportNodeHid.default);

	return transport;
};

describe("getVersion", () => {
	it("should pass with an app version", async () => {
		const subject = await createMockService(ledger.appVersion.record);

		await expect(subject.getVersion()).resolves.toBe(ledger.appVersion.result);
	});
});

describe("getPublicKey", () => {
	it("should pass with a compressed publicKey", async () => {
		const subject = await createMockService(ledger.publicKey.record);

		await expect(subject.getPublicKey("44'/1'/0'/0/0")).resolves.toEqual(
			"04c51a1a843e4661e603d7d28279dcf58c065f8a217818fa00202b666aa56faa8bc34334dc4dccef37155453d9ba37def4fbb0a259d7aa8b9f455ab22afc7791c0",
		);
		await expect(subject.getPublicKey("49'/1'/0'/0/0")).resolves.toEqual(
			"048bd2835af1ed447588b19d896ed4c550084bb3dc5f5e6b4998ed8b4774962f2978f5e2101e16a6c8ae2dddead4c7c6499c9f162a534b02bafca893f5eb7d2ebb",
		);
		await expect(subject.getPublicKey("84'/1'/0'/0/0")).resolves.toEqual(
			"04823b744a0a42c15851c1d8cd6415a792474dad4a401d997f96c7185985164e2df1fc13b34bb8ddf606d8e5658f8196fdd84845176e8c223e1d1442439e94a3b6",
		);
	});
});

describe("signTransaction", () => {
	it("should pass with a signature old", async () => {
		const subject = await createMockService(ledger.transaction.record);

		/**
		 *  btc: splitTransaction 02000000000101aaf23e0cb853c0820b5cbeb9292fff12fc925031905d1e90fc2f426f453930a80000000017160014ad5d241c585fd25d3271875af67a077ba4cf7324ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac47c070a000000000017a914d3cc481599f154c8cf7f9111681f7da53e54cd4b8702483045022100e83b0bf79dc14304fc1770aab7e50d1468578ab4d602c520d89ad36c97d067070220044704d8e6e5cf9d4d624b7cfc0bc20c8356ad716971bdb9f43ccbd99385048c012103987e47d69f9980f32363e40f50224fba7e22482459dc34d75e6f2353e9465d7600000000:
		 *  TX version 02000000 locktime f79dc143 timestamp  nVersionGroupId  nExpiryHeight  extraData
		 *  output 0: amount 01aaf23e0cb853c0 script 0b5cbeb9292fff12fc925031905d1e90fc2f426f453930a80000000017160014ad5d241c585fd25d3271875af67a077ba4cf7324ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac47c070a000000000017a914d3cc481599f154c8cf7f9111681f7da53e54cd4b8702483045022100e83b0b
		 */
		await expect(
			await subject.signTransaction("44'/0'/0'/0/0", Buffer.from("02000000000101aaf23e0cb853c0820b5cbeb9292fff12fc925031905d1e90fc2f426f453930a80000000017160014ad5d241c585fd25d3271875af67a077ba4cf7324ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac47c070a000000000017a914d3cc481599f154c8cf7f9111681f7da53e54cd4b8702483045022100e83b0bf79dc14304fc1770aab7e50d1468578ab4d602c520d89ad36c97d067070220044704d8e6e5cf9d4d624b7cfc0bc20c8356ad716971bdb9f43ccbd99385048c012103987e47d69f9980f32363e40f50224fba7e22482459dc34d75e6f2353e9465d7600000000")),
		).toEqual({});
	});
});

describe("mariano", () => {
	it("asdas", () => {
		const mnemonics =
			"abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
		const NETWORK = bitcoin.networks.regtest;
		const DEFAULT_LOCK_TIME = 0;
		const SIGHASH_ALL = 1;
		const PATHS = ["m/49'/1'/0'/0/0", "m/49'/1'/0'/0/1"];

		async function appBtc() {
			const transport = await TransportNodeHid.create();
			return new BtcApp(transport);
		}

		const compressPublicKey = (pk: string): string => {
			const { publicKey } = bitcoin.ECPair.fromPublicKey(Buffer.from(pk, "hex"));
			return publicKey.toString("hex");
		};

		function splitTransaction(ledger: BtcApp, tx: bitcoin.Transaction) {
			return ledger.splitTransaction(tx.toHex(), tx.hasWitnesses());
		}

		const signTransaction = async () => {
			const seed = await bip39.toSeed(mnemonics);
			const node = bitcoin.bip32.fromSeed(seed, NETWORK);
			const signers = PATHS.map((p) => node.derivePath(p));
			const publicKeys = signers.map((s) => s.publicKey);
			const p2ms = bitcoin.payments.p2ms({ pubkeys: publicKeys, network: NETWORK, m: 1 });
			const p2shP2ms = bitcoin.payments.p2sh({ redeem: p2ms, network: NETWORK });
			const previousTx =
				"02000000000101588e8fc89afea9adb79de2650f0cdba762f7d0880c29a1f20e7b468f97da9f850100000017160014345766130a8f8e83aef8621122ca14fff88e6d51ffffffff0240420f000000000017a914a0546d83e5f8876045d7025a230d87bf69db893287df9de6050000000017a9142ff4aa6ffa987335c7bdba58ef4cbfecbe9e49938702483045022100c654271a891af98e46ca4d82ede8cccb0503a430e50745f959274294c98030750220331b455fed13ff4286f6db699eca06aa0c1c37c45c9f3aed3a77a3b0187ff4ac0121037ebcf3cf122678b9dc89b339017c5b76bee9fedd068c7401f4a8eb1d7e841c3a00000000";
			const utxo = bitcoin.Transaction.fromHex(previousTx);
			const txIndex = 0;
			const destination = p2shP2ms;
			const redeemScript = destination.redeem?.output;
			// const witnessScript = destination.redeem.redeem.output;
			const ledgerRedeemScript = redeemScript;
			// use witness script if the outgoing transaction was from a p2sh-p2wsh-p2ms instead of p2sh-p2ms
			const fee = 1000;
			/** @type {number} */
			// @ts-ignore
			const amount = utxo.outs[txIndex].value;
			const withdrawAmount = amount - fee;
			const psbt = new bitcoin.Psbt({ network: NETWORK });
			const version = 1;
			psbt.addInput({
				hash: utxo.getId(),
				index: txIndex,
				nonWitnessUtxo: utxo.toBuffer(),
				redeemScript,
			});
			psbt.addOutput({
				address: "2MsK2NdiVEPCjBMFWbjFvQ39mxWPMopp5vp",
				value: withdrawAmount,
			});
			psbt.setVersion(version);
			/** @type {bitcoin.Transaction}  */
			// @ts-ignore
			const newTx = psbt.__CACHE.__TX;

			const ledger = await appBtc();
			const inLedgerTx = splitTransaction(ledger, utxo);
			const outLedgerTx = splitTransaction(ledger, newTx);
			const outputScriptHex = await serializer.serializeTransactionOutputs(outLedgerTx).toString("hex");

			/** @param {string} path */
			const signer = (path) => {
				const ecPrivate = node.derivePath(path);
				// actually only publicKey is needed, albeit ledger give an uncompressed one.
				return {
					network: NETWORK,
					publicKey: ecPrivate.publicKey,
					/** @param {Buffer} $hash */
					sign: async ($hash) => {
						const ledgerTxSignatures = await ledger.signP2SHTransaction({
							// @ts-ignore
							inputs: [[inLedgerTx, txIndex, ledgerRedeemScript.toString("hex")]],
							associatedKeysets: [path],
							outputScriptHex,
							lockTime: DEFAULT_LOCK_TIME,
							segwit: newTx.hasWitnesses(),
							transactionVersion: version,
							sigHashType: SIGHASH_ALL,
						});
						const [ledgerSignature] = ledgerTxSignatures;
						const expectedSignature = ecPrivate.sign($hash);
						const finalSignature = (() => {
							if (newTx.hasWitnesses()) {
								return Buffer.from(ledgerSignature, "hex");
							}
							return Buffer.concat([
								ledgerSignature,
								Buffer.from("01", "hex"), // SIGHASH_ALL
							]);
						})();
						console.log({
							expectedSignature: expectedSignature.toString("hex"),
							finalSignature: finalSignature.toString("hex"),
						});
						const { signature } = bitcoin.script.signature.decode(finalSignature);
						return signature;
					},
				};
			};
			await psbt.signInputAsync(0, signer(PATHS[0]));
			const validate = await psbt.validateSignaturesOfAllInputs();
			await psbt.finalizeAllInputs();
			const hex = psbt.extractTransaction().toHex();
			console.log({ validate, hex });
		};

		if (process.argv[1] === __filename) {
			signTransaction().catch(console.error);
		}
	});
});
