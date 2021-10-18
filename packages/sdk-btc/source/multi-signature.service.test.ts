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
import { unsignedTx } from "../test/fixtures/musig-txs";
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
	// let fixtures;

	// beforeEach(async () => {
	// 	fixtures = await require(`../test/fixtures/client/multisig-transactions.json`);
	// });
	//
	// test("#allWithPendingState", async () => {
	// 	nock(/.+/).post("/").reply(200, fixtures);
	//
	// 	await expect(subject.allWithPendingState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeArrayOfSize(3);
	// });
	//
	// test("#allWithReadyState", async () => {
	// 	nock(/.+/).post("/").reply(200, fixtures);
	//
	// 	await expect(subject.allWithReadyState("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeArrayOfSize(3);
	// });
	//
	// test("#findById", async () => {
	// 	nock(/.+/).post("/").reply(200, { result: fixtures.result[0] });
	//
	// 	await expect(subject.findById("DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).resolves.toBeObject();
	// });

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
		const wallet1 = {
			signingKey: musig.accounts[0].mnemonic,
			path: musig.accounts[0].nativeSegwitMasterPath,
		};
		const signatory = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet1.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet1.path,  // TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);
		const transactionData = unsignedTx;

		expect((await subject.addSignature(transactionData, signatory)).data().signatures).toEqual([
			"H4yJgFpPH6b0ED6OYBm0IJILt5u6h+E37WbKkTNjdAQZG/lS7ShWcyJ713QRNJRoEn3g7JrWcJjV+1hoicCAz6A=",
		]);

		const wallet2 = {
			signingKey: musig.accounts[1].mnemonic,
			path: musig.accounts[1].nativeSegwitMasterPath,
		};
		const signatory2 = new Signatories.Signatory(
			new Signatories.MnemonicSignatory({
				signingKey: wallet2.signingKey,
				address: "address", // Not needed / used
				publicKey: wallet2.path,  // TODO for now we use publicKey for passing path
				privateKey: "privateKey", // Not needed / used
			}),
		);

		expect((await subject.addSignature(transactionData, signatory2)).data().signatures).toEqual([
			"H4yJgFpPH6b0ED6OYBm0IJILt5u6h+E37WbKkTNjdAQZG/lS7ShWcyJ713QRNJRoEn3g7JrWcJjV+1hoicCAz6A=",
			"Hwap/1p+ng4GjwzJSzRw/YLi2mV1auhEWQa3mkP7j06BLHG+b69+VLBU68Qw0R0y0YTGsFi2b1Ls+dJZtk6b0FA=",
		]);
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

		expect(subject.needsWalletSignature(transaction, "DBk4cPYpqp7EBcvkstVDpyX7RQJNHxpMg8")).toBeFalse();
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
