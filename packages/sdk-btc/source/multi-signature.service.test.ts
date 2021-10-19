import "jest-extended";

import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { MultiSignatureService } from "./multi-signature.service";
import { DataTransferObjects } from "./coin.dtos";
import { ClientService } from "./client.service";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { AddressService } from "./address.service";
import { BindingType } from "./constants";
import { manyTxs, oneSignatureTx, threeSignatureTx, twoSignatureTx, unsignedTx } from "../test/fixtures/musig-txs";
import { musig } from "../test/fixtures/musig";

let subject: MultiSignatureService;

beforeAll(async () => {
	nock.disableNetConnect();

	subject = await createService(MultiSignatureService, "btc.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, DataTransferObjects);
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
	});
});

afterEach(() => nock.cleanAll());

describe("MultiSignatureService", () => {
	let fixtures;

	beforeEach(async () => {
		fixtures = { result: [...manyTxs] };
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
		nock("https://btc-test-musig.payvo.com").post("/").reply(200, { result: oneSignatureTx });

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
		const transactionData = { ...unsignedTx };

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
		expect((await subject.addSignature(transactionData, signatory)).data()).toEqual(oneSignatureTx);

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
		expect((await subject.addSignature(transactionData, signatory2)).data()).toEqual(twoSignatureTx);

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
		expect((await subject.addSignature(transactionData, signatory3)).data()).toEqual(threeSignatureTx);
	});

	test("#isMultiSignatureRegistrationReady", async () => {
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		expect(subject.isMultiSignatureReady(transaction)).toBeTrue();
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
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		expect(
			subject.needsWalletSignature(
				transaction,
				"Vpub5mtyU6Hx9xrx63Y3W4aGW1LuQkmwrq9xsQNgX7tDAM8DTHhE7vXMZ7Hue2FR8SMAGDW57fy76HFmN1jnckSmeX2cDMWVA1KViot6bLgJZuN",
			),
		).toBeFalse();
	});

	test("#needsFinalSignature", async () => {
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		expect(subject.needsFinalSignature(transaction)).toBeTrue();
	});

	test("#getValidMultiSignatures", async () => {
		const transaction = (await createService(SignedTransactionData)).configure("123", { signatures: [] });

		expect(subject.getValidMultiSignatures(transaction)).toEqual([]);
	});

	test("#remainingSignatureCount", async () => {
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

		expect(subject.remainingSignatureCount(transaction)).toBe(2);
	});
});
