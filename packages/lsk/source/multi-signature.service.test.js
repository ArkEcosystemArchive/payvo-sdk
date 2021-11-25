import { describe, loader, Mockery } from "@payvo/sdk-test";

import { DateTime } from "@payvo/sdk-intl";
import { IoC, Services, Signatories } from "@payvo/sdk";
import { nock } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { FeeService } from "./fee.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { MultiSignatureService } from "./multi-signature.service";
import { TransactionSerializer } from "./transaction.serializer";
import { BindingType } from "./coin.contract";
import { AssetSerializer } from "./asset.serializer";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;
let musig;

const createLocalServices = async () => {
	nock.fake(/.+/)
		.get("/api/v2/accounts")
		.query({ address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p" })
		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
		.get("/api/v2/accounts")
		.query({ publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed" })
		.reply(200, loader.json(`test/fixtures/musig/lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p.json`))
		.persist();

	subject = await createService(TransactionService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});

	musig = createService(MultiSignatureService, "lsk.testnet", (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.FeeService, FeeService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(BindingType.AssetSerializer, AssetSerializer);
		container.singleton(BindingType.TransactionSerializer, TransactionSerializer);
	});
};

const wallet1 = {
	signingKey: "foil broccoli rare pony man umbrella visual cram wing rotate fall never",
	address: "lskp4agpmjwgw549xdrhgdt6dfwqrpvohgbkhyt8p",
	publicKey: "ac574896c846b59477a9115b952563938c48d0096b84846c0b634a621e1774ed",
};

const wallet2 = {
	signingKey: "penalty name learn right reason inherit peace mango guitar heart nature love",
	address: "lskn2de9mo9z3g9jvbpj4yjn84vrvjzcn5c5mon7a",
	publicKey: "5f7f98c50575a4a7e70a46ff35b72f4fe2a1ad3bc9a918b692d132d9c556bdf0",
};

describe("#addSignature", async ({ beforeEach, assert, it }) => {
	beforeEach(async () => {
		await createLocalServices();

		Mockery.stub(DateTime, "make").returnValueOnce(DateTime.make("2021-01-01 12:00:00"));
	});

	it("should succeed", async () => {
		const transaction1 = await subject.transfer({
			fee: 10,
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet1.signingKey,
					address: wallet1.address,
					publicKey: wallet1.publicKey,
					privateKey: identity.privateKey,
				}),
			),
			data: {
				amount: 1,
				to: wallet1.address,
			},
		});

		assert.instance(transaction1, SignedTransactionData);

		assert.false(musig.isMultiSignatureReady(transaction1));
		assert.true(musig.needsSignatures(transaction1));
		assert.true(musig.needsAllSignatures(transaction1));
		assert.is(musig.remainingSignatureCount(transaction1), 1);
		assert.false(musig.needsWalletSignature(transaction1, wallet1.publicKey));
		assert.true(musig.needsWalletSignature(transaction1, wallet2.publicKey));

		const transaction2 = await musig.addSignature(
			transaction1.data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: wallet2.address,
					publicKey: wallet2.publicKey,
					privateKey: identity.privateKey,
				}),
			),
		);

		assert.instance(transaction2, SignedTransactionData);

		assert.true(musig.isMultiSignatureReady(transaction2));
		assert.false(musig.needsSignatures(transaction2));
		assert.false(musig.needsAllSignatures(transaction2));
		assert.is(musig.remainingSignatureCount(transaction2), 0);
		assert.false(musig.needsWalletSignature(transaction2, wallet1.publicKey));
		assert.false(musig.needsWalletSignature(transaction2, wallet2.publicKey));
	});
});

describe("#broadcast", ({ beforeEach, assert, it }) => {
	let transaction;

	beforeEach(async () => {
		await createLocalServices();

		transaction = await musig.addSignature(
			(
				await subject.transfer({
					fee: 10,
					signatory: new Signatories.Signatory(
						new Signatories.MnemonicSignatory({
							signingKey: wallet1.signingKey,
							address: wallet1.address,
							publicKey: wallet1.publicKey,
							privateKey: identity.privateKey,
						}),
					),
					data: {
						amount: 1,
						to: wallet1.address,
					},
				})
			).data(),
			new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: wallet2.signingKey,
					address: wallet2.address,
					publicKey: wallet2.publicKey,
					privateKey: identity.privateKey,
				}),
			),
		);
	});

	it("should broadcast a transaction", async () => {
		nock.fake(/.+/)
			.post("/", (body) => body.method === "store")
			.reply(200, {
				result: { id: transaction.id() },
			});

		assert.equal(await musig.broadcast(transaction.data()), {
			accepted: [transaction.id()],
			errors: {},
			rejected: [],
		});
	});

	it("should handle error", async () => {
		nock.fake(/.+/)
			.post("/", (body) => body.method === "store")
			.reply(400, {
				message: "Unable to broadcast transaction.",
			});

		assert.equal(await musig.broadcast(transaction.data()), {
			accepted: [],
			errors: {
				[transaction.id()]: "Unable to broadcast transaction.",
			},
			rejected: [transaction.id()],
		});
	});
});

describe("#needsFinalSignature", async ({ it, assert }) => {
	it("should succeed", async () => {
		await createLocalServices();

		assert.true(musig.needsFinalSignature(
			await subject.transfer({
				fee: 10,
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: wallet1.signingKey,
						address: wallet1.address,
						publicKey: wallet1.publicKey,
						privateKey: identity.privateKey,
					}),
				),
				data: {
					amount: 1,
					to: wallet1.address,
				},
			}),
		));
	});
});

describe("#allWithPendingState", async ({ it, assert }) => {
	it("#should succeed", async () => {
		nock.fake(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "list",
				params: {
					publicKey: identity.publicKey,
					state: "pending",
				},
			})
			.reply(200, {
				result: [
					{ data: {}, multiSignature: {} },
					{ data: {}, multiSignature: {} },
				],
			});

		await assert.length(await musig.allWithPendingState(identity.publicKey), 2);
	});
});

describe("#allWithReadyState", async ({ it, assert }) => {
	it("should succeed", async () => {
		nock.fake(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "list",
				params: {
					publicKey: identity.publicKey,
					state: "ready",
				},
			})
			.reply(200, {
				result: [
					{ data: {}, multiSignature: {} },
					{ data: {}, multiSignature: {} },
				],
			});

		assert.length(await musig.allWithReadyState(identity.publicKey), 2);
	});
});

describe("#findById", async ({ it, assert }) => {
	it("should succeed", async () => {
		nock.fake(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "show",
				params: {
					id: "384b0438-36c0-4437-a35b-a8135cbba17d",
				},
			})
			.reply(200, { result: { data: {}, multiSignature: {} } });

		assert.equal(await musig.findById("384b0438-36c0-4437-a35b-a8135cbba17d"), {
			multiSignature: {},
		});
	});
});

describe("#forgetById", async ({ it, assert }) => {
	it("should succeed", async () => {
		const deleteNock = nock
			.fake(/.+/)
			.post("/", {
				jsonrpc: "2.0",
				id: /.+/,
				method: "delete",
				params: {
					id: "384b0438-36c0-4437-a35b-a8135cbba17d",
				},
			})
			.reply(200, {});

		assert.false(deleteNock.isDone());

		await musig.forgetById("384b0438-36c0-4437-a35b-a8135cbba17d");

		assert.true(deleteNock.isDone());
	});
});
