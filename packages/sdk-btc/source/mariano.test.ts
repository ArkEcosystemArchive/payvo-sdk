import "jest-extended";
import * as bitcoin from "bitcoinjs-lib";
import nock from "nock";
import createXpub from "create-xpub";
import BtcApp from "@ledgerhq/hw-app-btc";

import { IoC, Services, Signatories } from "@payvo/sdk";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid-singleton";
import logger from "@ledgerhq/logs";
import { jest } from "@jest/globals";
import { createService } from "../test/mocking";
import { DataTransferObjects } from "./coin.dtos";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { LedgerService } from "./ledger.service";

import cryptography from "@payvo/cryptography";
import { DateTime } from "@payvo/intl";
import { TransactionService } from "./transaction.service";
import { BindingType } from "./constants";
import { AddressFactory } from "./address.factory";
import { FeeService } from "./fee.service";

jest.setTimeout(20_000);

let ledgerService: LedgerService;

const createMockService = async () => {
	logger.listen((log) => console.info(log.type + ": " + log.message));

	const transactionService = await createService(
		TransactionService,
		"btc.testnet",
		async (container: IoC.Container) => {
			container.constant(IoC.BindingType.Container, container);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.FeeService, FeeService);
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(BindingType.AddressFactory, AddressFactory);

			ledgerService = container.get(IoC.BindingType.LedgerService);
			// @ts-ignore
			await ledgerService.connect(TransportNodeHid.default);
		},
	);

	return transactionService;
};

const compressPublicKey = (pubKey: string, network: bitcoin.networks.Network): string => {
	const key = bitcoin.ECPair.fromPublicKey(Buffer.from(pubKey, "hex"), {
		network,
	});
	console.log(key);
	const { publicKey } = key;
	return publicKey.toString("hex");
};

it("should create xpub from nano retrieved public key", async function () {
	const network = bitcoin.networks.testnet;

	const walletData = {
		path: "44'/1'/0'",
		publicKey:
			"047cdc8c71b62628703c486378dd38254dda909038d52c68a5c6acf5af0b7239991fa292a7cfc747ca94f015484233b8563a22fec7aa9c6b5d796028314c351d30",
		bitcoinAddress: "mrAnhdVfLEFhzVbn8nL9WdTCzmqomJaEsn",
		chainCode: "252f8df8aa4cec969cf1befa706a2a93265ffe4d2c4d407493bfd4508de371d7",
		compressed: "027cdc8c71b62628703c486378dd38254dda909038d52c68a5c6acf5af0b723999",
		base58: "tpubDCzoRb9kb5qSjv1RcX5g4bJ9h28uuaqeuEhFmHCgtGRuoxB121X1e4DSwq44AD1gv7Lu33ije8b4b7fX8oXp3h28CRycqJkFJRd7GSSV7YK",
	};
	const expectedBip32Interface = cryptography.BIP32.fromBase58(walletData.base58, network);
	console.log("expectedBip32Interface", walletData.base58, expectedBip32Interface);

	const xpub2 = createXpub({
		networkVersion: createXpub.testnet,
		depth: 3, // @TODO Derive this from given path
		childNumber: 2147483648,
		chainCode: walletData.chainCode,
		publicKey: walletData.publicKey,
	});
	console.log(xpub2);
	const obtainedBip32Interface = cryptography.BIP32.fromBase58(xpub2, network);

	expect(xpub2).not.toBe(walletData.base58);
	expect(obtainedBip32Interface.derive(0).derive(0).toBase58()).toBe(
		expectedBip32Interface.derive(0).derive(0).toBase58(),
	);

	console.log("expectedBip32Interface", expectedBip32Interface.derive(0).derive(0).toBase58());
	console.log("obtainedBip32Interface", obtainedBip32Interface.derive(0).derive(0).toBase58());
});

describe("signTransaction", () => {
	nock.recorder.rec();
	it("should generate a transfer transaction and sign with Ledger", async () => {
		const signatory = new Signatories.Signatory(
			new Signatories.LedgerSignatory({
				signingKey: "doesn't matter",
				options: {
					bip44: {
						account: 0,
					},
				},
			}),
		);
		const subject: TransactionService = await createMockService();
		// // @ts-ignore
		// await subject.connect(TransportNodeHid.default);

		const result = await subject.transfer({
			data: {
				amount: 0.001,
				to: "tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn",
			},
			signatory,
		});

		expect(result.id()).toBe("9bbea6184489022daf7f4bf22fd82a670eb9e4bbc5c5811bfd046d9dfe641d12");
		expect(result.sender()).toBe("mv9pNZs3d65sjL68JueZDphWe3vHNmmSn6");
		expect(result.recipient()).toBe("tb1q705a7ak4ejlmfc5uq3afg2q45v4yw7kyv8jgsn");
		expect(result.amount().toNumber()).toBe(100_000);
		expect(result.fee().toNumber()).toBe(242_724);
		expect(result.timestamp()).toBeInstanceOf(DateTime);
		expect(result.toBroadcast()).toBe(
			"0200000001e6eb100bcd16a7347f3405b804b372726e761c2e13f0557aee1ade1a796a3394000000006a4730440220486047e297b38311f72868d32abe495796687fb72b12d125e45b7aef139510730220196da73e2e30d607dc05bbf396ba0cee63e00fa9eee4a7518a89294ad6346515012102692389c4f8121468f18e779b66253b7eb9495fe215dc1edf0e11cbaeff3f67c8ffffffff02a086010000000000160014f3e9df76d5ccbfb4e29c047a942815a32a477ac47c070a00000000001976a914c6099396735474ac6ff0ed5d0d0ad3f55f470f5488ac00000000",
		);
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

			const signer = (path: string) => {
				const compressPublicKey = (pubKey) => {
					const { publicKey } = bitcoin.ECPair.fromPublicKey(Buffer.from(pubKey, "hex"));
					return publicKey.toString("hex");
				};
				const walletPublicKey = await ledger.getWalletPublicKey(path);
				const publicKey = compressPublicKey(walletPublicKey.publicKey);
				return {
					network: NETWORK,
					publicKey,
					sign: async ($hash: Buffer) => {
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
