import "jest-extended";
import { jest } from "@jest/globals";

import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { openTransportReplayer, RecordStore } from "@ledgerhq/hw-transport-mocker";
import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { MultiSignatureService } from "./multi-signature.service";
import { ClientService } from "./client.service";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { AddressService } from "./address.service";
import { BindingType } from "./constants";
import { musig } from "../test/fixtures/musig";
import { UUID } from "@payvo/sdk-cryptography";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";
import {
	manyMusigRegistrationTxs,
	oneSignatureNativeSegwitMusigRegistrationTx,
	oneSignatureNativeSegwitMusigTransferTx,
	threeSignatureNativeSegwitMusigRegistrationTx,
	threeSignatureNativeSegwitMusigTransferTx,
	twoSignatureNativeSegwitMusigRegistrationTx,
	twoSignatureNativeSegwitMusigTransferTx,
	unsignedNativeSegwitMusigRegistrationTx,
	unsignedNativeSegwitMusigTransferTx,
} from "../test/fixtures/musig-native-segwit-txs";

let subject: MultiSignatureService;

beforeAll(async () => {
	nock.disableNetConnect();

	subject = await createService(MultiSignatureService, "btc.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(
			IoC.BindingType.LedgerTransportFactory,
			async () => await openTransportReplayer(RecordStore.fromString("")),
		);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

afterEach(() => nock.cleanAll());

describe("MultiSignatureService", () => {
	describe("multi signature registration", () => {
		let fixtures;

		beforeEach(async () => {
			fixtures = { result: [...manyMusigRegistrationTxs] };
		});

		test("#allWithPendingState", async () => {
			nock("https://btc-test-musig.payvo.com").post("/").reply(200, fixtures);

			await expect(
				subject.allWithPendingState(
					"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				),
			).resolves.toBeArrayOfSize(2);
		});

		test("#allWithReadyState", async () => {
			nock("https://btc-test-musig.payvo.com").post("/").reply(200, fixtures);

			await expect(
				subject.allWithReadyState(
					"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				),
			).resolves.toBeArrayOfSize(2);
		});

		test("#findById", async () => {
			nock("https://btc-test-musig.payvo.com")
				.post("/")
				.reply(200, { result: oneSignatureNativeSegwitMusigRegistrationTx });

			await expect(
				subject.findById(
					"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				),
			).resolves.toBeObject();
		});

		test("#broadcast", async () => {
			nock("https://btc-test-musig.payvo.com")
				.post("/")
				.reply(200, { result: { id: "abc" } })
				.post("/")
				.reply(200, { result: { id: "abc" } });

			await expect(subject.broadcast({})).resolves.toEqual({ accepted: ["abc"], errors: {}, rejected: [] });
			await expect(subject.broadcast({ asset: { multiSignature: "123" } })).resolves.toEqual({
				accepted: ["abc"],
				errors: {},
				rejected: [],
			});
		});

		test("#addSignature", async () => {
			// We need a deep copy as signing modifies the signatures and public keys
			const transactionData = JSON.parse(JSON.stringify(unsignedNativeSegwitMusigRegistrationTx));

			const wallet1 = {
				signingKey: musig.accounts[0].mnemonic,
				path: musig.accounts[0].nativeSegwitMasterPath,
			};
			const signatory = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet1.path, // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			);
			// Add wallet's public key and sign it
			transactionData.multiSignature.publicKeys.push(
				"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
			);
			expect((await subject.addSignature(transactionData, signatory)).data()).toEqual(
				oneSignatureNativeSegwitMusigRegistrationTx,
			);

			const wallet2 = {
				signingKey: musig.accounts[1].mnemonic,
				path: musig.accounts[1].nativeSegwitMasterPath,
			};
			const signatory2 = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet2.path, // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			);
			// Add wallet's public key and sign it
			transactionData.multiSignature.publicKeys.push(
				"Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1",
			);
			expect((await subject.addSignature(transactionData, signatory2)).data()).toEqual(
				twoSignatureNativeSegwitMusigRegistrationTx,
			);

			const wallet3 = {
				signingKey: musig.accounts[2].mnemonic,
				path: musig.accounts[2].nativeSegwitMasterPath,
			};
			const signatory3 = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet3.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet3.path, // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			);
			// Add wallet's public key and sign it
			transactionData.multiSignature.publicKeys.push(
				"Vpub5mSSLBPFi3acdjk5giwrmA7gXPAJsiLXXKibgjXYycH1gp95t2Pqv3U8dT9kEGxvAdfiN5DGmozDmZ7sJyDuMgfxt4h4KujF7MWt5tQH8py",
			);
			expect((await subject.addSignature(transactionData, signatory3)).data()).toEqual(
				threeSignatureNativeSegwitMusigRegistrationTx,
			);
		});

		describe.each([
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected: false },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected: false },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected: false },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected: true },
		])("#isMultiSignatureRegistrationReady", ({ tx, expected }) => {
			test(`when already signed by ${tx.signatures.length} participants`, async () => {
				const transaction = (await createService(SignedTransactionData)).configure(tx.id, tx);

				expect(subject.isMultiSignatureReady(transaction)).toBe(expected);
			});
		});

		test("#needsSignatures", async () => {
			const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

			expect(subject.needsSignatures(transaction)).toBeFalse();
		});

		test("#needsAllSignatures", async () => {
			const transaction = (await createService(SignedTransactionData)).configure("123", {
				signatures: [],
				multiSignature: {
					publicKeys: [
						"0301fd417566397113ba8c55de2f093a572744ed1829b37b56a129058000ef7bce",
						"034151a3ec46b5670a682b0a63394f863587d1bc97483b1b6c70eb58e7f0aed192",
					],
					min: 2,
				},
			});

			expect(subject.needsAllSignatures(transaction)).toBeTrue();
		});

		test("#needsWalletSignature", async () => {
			const transaction = (await createService(SignedTransactionData)).configure(
				oneSignatureNativeSegwitMusigRegistrationTx.id,
				oneSignatureNativeSegwitMusigRegistrationTx,
			);

			expect(
				subject.needsWalletSignature(
					transaction,
					"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
				),
			).toBeFalse();

			expect(
				subject.needsWalletSignature(
					transaction,
					"Vpub5mYgzMb93fDtChZ2xmY7g3aEgHFjdgQE6P596AiL5zENEcVjDCciGfWmhZJngn6gVmBRh6E1Vp7aZYY7wQkMRTQSKhauGwYAUEdiGbS35D1",
				),
			).toBeTrue();
		});

		test("#needsFinalSignature", async () => {
			const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

			expect(subject.needsFinalSignature(transaction)).toBeFalse();
		});

		describe.each([
			{ tx: unsignedNativeSegwitMusigRegistrationTx, expected: 3 },
			{ tx: oneSignatureNativeSegwitMusigRegistrationTx, expected: 2 },
			{ tx: twoSignatureNativeSegwitMusigRegistrationTx, expected: 1 },
			{ tx: threeSignatureNativeSegwitMusigRegistrationTx, expected: 0 },
		])("#remainingSignatureCount", ({ tx, expected }) => {
			test(`when already signed by ${tx.signatures.length} participants`, async () => {
				const transaction = (await createService(SignedTransactionData)).configure(tx.id, tx);

				expect(subject.remainingSignatureCount(transaction)).toBe(expected);
			});
		});
	});

	describe("transfer", () => {
		test("#broadcast", async () => {
			jest.spyOn(UUID, "random").mockReturnValueOnce("68db1bb0-d747-48e8-b6f6-e347cc01b568");

			const { multiSignature, ...data } = unsignedNativeSegwitMusigTransferTx;
			nock("https://btc-test-musig.payvo.com")
				.post("/", {
					jsonrpc: "2.0",
					id: "68db1bb0-d747-48e8-b6f6-e347cc01b568",
					method: "store",
					params: { data: data as any, multiSignature },
				})
				.reply(
					200,
					'{"id":"68db1bb0-d747-48e8-b6f6-e347cc01b568","jsonrpc":"2.0","result":{"id":"189f015c-2a58-4664-83f4-0b331fa9172a"}}',
				);

			await expect(subject.broadcast(unsignedNativeSegwitMusigTransferTx)).resolves.toEqual({
				accepted: [unsignedNativeSegwitMusigTransferTx.id],
				errors: {},
				rejected: [],
			});
		});

		describe.each([
			{ tx: unsignedNativeSegwitMusigTransferTx, expected: 2 },
			// { tx: twoSignatureMusigRegistrationTx, expected: 1 },
			// { tx: threeSignatureMusigRegistrationTx, expected: 0 },
		])("#remainingSignatureCount", ({ tx, expected }) => {
			test.skip(`when already signed by ${tx.signatures.length} participants`, async () => {
				const transaction = (await createService(SignedTransactionData)).configure(tx.id, tx);

				expect(subject.remainingSignatureCount(transaction)).toBe(expected);
			});
		});

		test("#addSignature", async () => {
			// We need a deep copy as signing modifies the signatures and public keys
			const transactionData = JSON.parse(JSON.stringify(unsignedNativeSegwitMusigTransferTx));

			const wallet1 = {
				signingKey: musig.accounts[0].mnemonic,
				path: musig.accounts[0].nativeSegwitMasterPath,
			};
			const signatory1 = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet1.path, // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			);

			const signedTransaction1 = await subject.addSignature(transactionData, signatory1);
			expect(signedTransaction1.data()).toEqual(oneSignatureNativeSegwitMusigTransferTx);

			const wallet2 = {
				signingKey: musig.accounts[1].mnemonic,
				path: musig.accounts[1].nativeSegwitMasterPath,
			};
			const signatory2 = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet2.path, // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			);
			const signedTransaction2 = await subject.addSignature(signedTransaction1.data(), signatory2);
			expect(signedTransaction2.data()).toEqual(twoSignatureNativeSegwitMusigTransferTx);

			const wallet3 = {
				signingKey: musig.accounts[2].mnemonic,
				path: musig.accounts[2].nativeSegwitMasterPath,
			};
			const signatory3 = new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet3.signingKey,
					address: "address", // Not needed / used
					publicKey: wallet3.path, // TODO for now we use publicKey for passing path
					privateKey: "privateKey", // Not needed / used
				}),
			);
			const signedTransaction3 = await subject.addSignature(signedTransaction2.data(), signatory3);
			expect(signedTransaction3.data()).toEqual(threeSignatureNativeSegwitMusigTransferTx);
		});
	});
});
