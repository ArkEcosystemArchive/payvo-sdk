import "jest-extended";

import { IoC, Services } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { MultiSignatureService } from "./multi-signature.service";
import { DataTransferObjects } from "./coin.dtos";
import { ClientService } from "./client.service";
import { BindingType } from "./coin.contract";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { AddressService } from "./address.service";

let subject: MultiSignatureService;

beforeAll(() => {
	nock.disableNetConnect();

	subject = createService(MultiSignatureService, undefined, (container) => {
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
	const fixtures = require(`${__dirname}/../test/fixtures/client/multisig-transactions.json`);

	test("#allWithPendingState", async () => {
		nock(/.+/).post("/").reply(200, fixtures);

		await expect(subject.allWithPendingState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeArrayOfSize(3);
	});

	test("#allWithReadyState", async () => {
		nock(/.+/).post("/").reply(200, fixtures);

		await expect(subject.allWithReadyState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeArrayOfSize(3);
	});

	test("#findById", async () => {
		nock(/.+/).post("/").reply(200, { result: fixtures.result[0] });

		await expect(subject.findById("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeObject();
	});

	test("#broadcast", async () => {
		nock(/.+/)
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

	test("#isMultiSignatureRegistrationReady", () => {
		const transaction = createService(SignedTransactionData).configure("123", { signatures: [] });

		expect(subject.isMultiSignatureReady(transaction)).toBeTrue();
	});

	test("#needsSignatures", () => {
		const transaction = createService(SignedTransactionData).configure("123", { signatures: [] });

		expect(subject.needsSignatures(transaction)).toBeFalse();
	});

	test("#needsAllSignatures", () => {
		const transaction = createService(SignedTransactionData).configure("123", {
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

	test("#needsWalletSignature", () => {
		const transaction = createService(SignedTransactionData).configure("123", { signatures: [] });

		expect(subject.needsWalletSignature(transaction, "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).toBeFalse();
	});

	test("#needsFinalSignature", () => {
		const transaction = createService(SignedTransactionData).configure("123", { signatures: [] });

		expect(subject.needsFinalSignature(transaction)).toBeTrue();
	});

	test("#getValidMultiSignatures", () => {
		const transaction = createService(SignedTransactionData).configure("123", { signatures: [] });

		expect(subject.getValidMultiSignatures(transaction)).toEqual([]);
	});

	test("#remainingSignatureCount", () => {
		const transaction = createService(SignedTransactionData).configure("123", {
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
