import { describe } from "@payvo/sdk-test";
import { Transactions } from "./crypto/index.js";
import { IoC, Services, Signatories } from "@payvo/sdk";

import { createService } from "../test/mocking";
import { BindingType } from "./coin.contract";
import { AddressService } from "./address.service.js";
import { ClientService } from "./client.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { LedgerService } from "./ledger.service.js";
import { PublicKeyService } from "./public-key.service.js";
import { TransactionService } from "./transaction.service.js";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { MultiSignatureService } from "./multi-signature.service.js";
import { identity } from "../test/fixtures/identity";
import { SignedTransactionData } from "./signed-transaction.dto.js";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";
import { WalletData } from "./wallet.dto.js";

describe("TransactionService", async ({ assert, beforeAll, nock, it, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(TransactionService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.factory(BindingType.MultiSignatureSigner, MultiSignatureSigner);
			container.constant(IoC.BindingType.DataTransferObjects, {
				SignedTransactionData,
				ConfirmedTransactionData,
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
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
				memo: "foo",
			},
			fee: 1,
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
		assert.is(result.amount().toNumber(), 100_000_000);
	});

	it("should verify without nonce", async (context) => {
		nock.fake(/.+/)
			.get(`/api/wallets/${identity.address}`)
			.reply(200, { data: { nonce: "1" } });

		const result = await context.subject.transfer({
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should verify without nonce if uses secondary wif", async (context) => {
		nock.fake(/.+/)
			.get(`/api/wallets/${identity.address}`)
			.reply(200, { data: { nonce: "1" } });

		const result = await context.subject.transfer({
			signatory: new Signatories.Signatory(
				new Signatories.ConfirmationWIFSignatory({
					signingKey: identity.wif,
					confirmKey: identity.wif,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should sign with a custom expiration", async (context) => {
		const result = await context.subject.transfer({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
				expiration: 102,
			},
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
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
			},
		});
		assert.is(result.toObject().data.expiration, 6795392);
	});

	it("should add a signature if the sender public key is a multi-signature wallet", async (context) => {
		nock.fake(/.+/)
			.get("/api/wallets/DBHbggggWbDUhdiqeh9HQ6b5Ryfit7Esek")
			.reply(200, loader.json(`test/fixtures/client/DKkBL5Mg9v1TPcKQrcUuW1VQrVFu8bh82Q.json`));

		const result = await context.subject.transfer({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
				{
					publicKeys: [
						identity.publicKey,
						"023197268b110ca9c695f181d43a159ce380902ec549fe641e8bda047da0daf989",
						"032b0c8dccc71dde04bfc1281d3a35428a48acf0b72be9a3914d4ebca1d5a73c32",
						"0380c64e07942aee235387b4cbdc00923f7f486b4f5051bef806e0514e93222dc5",
						"029e4dac4887b1b5d764b877559ad5171932f75e4fdefcb9ee3a96adb78d254bc4",
						"034996d0a7b9788386b9d8d6ae86af0a0d676aee657c69b3e506648c69e39c15ea",
					],
					min: 4,
				},
			),
			data: {
				amount: 1,
				to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
				memo: "foo",
			},
			fee: 1,
		});

		assert.length(result.data().signatures, 1);
	});

	it("should create a second signature", async (context) => {
		const result = await context.subject.secondSignature({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				mnemonic: "this is a top secret second mnemonic",
			},
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a delegate registration", async (context) => {
		const result = await context.subject.delegateRegistration({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				username: "johndoe",
			},
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a vote", async (context) => {
		const result = await context.subject.vote({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				votes: [
					{
						id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
						amount: 0,
					},
				],
				unvotes: [
					{
						id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621ded",
						amount: 0,
					},
				],
			},
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a ipfs", async (context) => {
		const result = await context.subject.ipfs({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: { hash: "QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9w" },
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a multi payment", async (context) => {
		const result = await context.subject.multiPayment({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				payments: [
					{ to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
					{ to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
					{ to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
				],
				memo: "foo",
			},
		});

		assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
	});

	it("should create a delegate resignation", async (context) => {
		const result = await context.subject.delegateResignation({
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: "publicKey",
					privateKey: "privateKey",
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
