import { IoC, Services, Signatories } from "@payvo/sdk";
import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { Transactions } from "./crypto/index.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { MultiSignatureService } from "./multi-signature.service.js";
import { MultiSignatureSigner } from "./multi-signature.signer.js";
import { PublicKeyService } from "./public-key.service.js";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { TransactionService } from "./transaction.service.js";
import { WalletData } from "./wallet.dto.js";

describe("TransactionService", async ({ assert, beforeAll, nock, it, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(TransactionService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.factory(MultiSignatureSigner);
			container.constant(IoC.BindingType.DataTransferObjects, {
				ConfirmedTransactionData,
				SignedTransactionData,
				WalletData,
			});
			container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.ClientService, ClientService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
			container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
			container.singleton(IoC.BindingType.LedgerService, LedgerService);
			container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
			container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
		});
	});

	it("should create a transfer", async (context) => {
		const result = await context.subject.transfer({
			data: {
				amount: 1,
				memo: "foo",
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
			fee: 1,
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
		assert.is(result.amount().toNumber(), 100_000_000);
	});

	it("should verify without nonce", async (context) => {
		nock.fake(/.+/)
			.get(`/api/wallets/${identity.address}`)
			.reply(200, { data: { nonce: "1" } });

		const result = await context.subject.transfer({
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should verify without nonce if uses secondary wif", async (context) => {
		nock.fake(/.+/)
			.get(`/api/wallets/${identity.address}`)
			.reply(200, { data: { nonce: "1" } });

		const result = await context.subject.transfer({
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
			signatory: new Signatories.Signatory(
				new Signatories.ConfirmationWIFSignatory({
					address: identity.address,
					confirmKey: identity.wif,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.wif,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should sign with a custom expiration", async (context) => {
		const result = await context.subject.transfer({
			data: {
				amount: 1,
				expiration: 102,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.is(result.id(), "b6eb0b8ff36c77ab3e2a8384d1df4d0d68cb398f220ee9073dd82fe5828d7cbf");
	});

	it("should sign using network estimated expiration", async (context) => {
		nock.fake(/.+/)
			.get("/api/blockchain")
			.reply(200, loader.json("test/fixtures/client/blockchain.json"))
			.get("/api/node/configuration")
			.reply(200, loader.json("test/fixtures/client/configuration.json"));

		const result = await context.subject.transfer({
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});
		assert.is(result.toObject().data.expiration, 6_795_392);
	});

	it("should add a signature if the sender public key is a multi-signature wallet", async (context) => {
		nock.fake(/.+/)
			.get("/api/wallets/DBHbggggWbDUhdiqeh9HQ6b5Ryfit7Esek")
			.reply(200, loader.json(`test/fixtures/client/DKkBL5Mg9v1TPcKQrcUuW1VQrVFu8bh82Q.json`));

		const result = await context.subject.transfer({
			data: {
				amount: 1,
				memo: "foo",
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
			fee: 1,
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: identity.privateKey,
					publicKey: identity.publicKey,
					signingKey: identity.mnemonic,
				}),
				{
					min: 4,
					publicKeys: [
						identity.publicKey,
						"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
						"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
						"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
						"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
						"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
					],
				},
			),
		});

		assert.length(result.data().signatures, 1);
	});

	it("should create a second signature", async (context) => {
		const result = await context.subject.secondSignature({
			data: {
				mnemonic: "this is a top secret second mnemonic",
			},
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a delegate registration", async (context) => {
		const result = await context.subject.delegateRegistration({
			data: {
				username: "johndoe",
			},
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a vote", async (context) => {
		const result = await context.subject.vote({
			data: {
				unvotes: [
					{
						amount: 0,
						id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621ded",
					},
				],
				votes: [
					{
						amount: 0,
						id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
					},
				],
			},
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a ipfs", async (context) => {
		const result = await context.subject.ipfs({
			data: { hash: "QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9w" },
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a multi payment", async (context) => {
		const result = await context.subject.multiPayment({
			data: {
				memo: "foo",
				payments: [
					{ amount: 10, to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9" },
					{ amount: 10, to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9" },
					{ amount: 10, to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9" },
				],
			},
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a delegate resignation", async (context) => {
		const result = await context.subject.delegateResignation({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					address: identity.address,
					privateKey: "privateKey",
					publicKey: "publicKey",
					signingKey: identity.mnemonic,
				}),
			),
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should estimate expiration", async (context) => {
		nock.fake(/.+/)
			.get("/api/blockchain")
			.reply(200, loader.json("test/fixtures/client/blockchain.json"))
			.get("/api/node/configuration")
			.reply(200, loader.json("test/fixtures/client/configuration.json"))
			.persist();

		assert.is(await context.subject.estimateExpiration(), "6795392");
	});
});
