import { assert, loader, test } from "@payvo/sdk-test";
import { Transactions } from "@arkecosystem/crypto";
import { IoC, Services, Signatories } from "@payvo/sdk";
import nock from "nock";

import { createService } from "../test/mocking";
import { BindingType } from "./coin.contract";
import { AddressService } from "./address.service";
import { ClientService } from "./client.service";
import { KeyPairService } from "./key-pair.service";
import { LedgerService } from "./ledger.service";
import { PublicKeyService } from "./public-key.service";
import { TransactionService } from "./transaction.service";
import { MultiSignatureSigner } from "./multi-signature.signer";
import { MultiSignatureService } from "./multi-signature.service";
import { identity } from "../test/fixtures/identity";
import { SignedTransactionData } from "./signed-transaction.dto";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";
import { WalletData } from "./wallet.dto";

let subject;

test.after.each(() => nock.cleanAll());

test.before(async () => {
	nock.disableNetConnect();

	subject = await createService(TransactionService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
		container.singleton(BindingType.MultiSignatureSigner, MultiSignatureSigner);
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(IoC.BindingType.ClientService, ClientService);
		container.constant(IoC.BindingType.DataTransferObjects, {
			SignedTransactionData,
			ConfirmedTransactionData,
			WalletData,
		});
		container.singleton(IoC.BindingType.DataTransferObjectService, Services.AbstractDataTransferObjectService);
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		container.constant(IoC.BindingType.LedgerTransportFactory, async () => {});
		container.singleton(IoC.BindingType.LedgerService, LedgerService);
		container.singleton(IoC.BindingType.PublicKeyService, PublicKeyService);
		container.singleton(IoC.BindingType.MultiSignatureService, MultiSignatureService);
	});
});

test("#transfer", async () => {
	const result = await subject.transfer({
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

test("should verify without nonce", async () => {
	nock(/.+/)
		.get(`/api/wallets/${identity.address}`)
		.reply(200, { data: { nonce: "1" } });

	const result = await subject.transfer({
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

test("should verify without nonce if uses secondary wif", async () => {
	nock(/.+/)
		.get(`/api/wallets/${identity.address}`)
		.reply(200, { data: { nonce: "1" } });

	const result = await subject.transfer({
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

test("should sign with a custom expiration", async () => {
	const result = await subject.transfer({
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

test("should sign using network estimated expiration", async () => {
	nock(/.+/)
		.get("/api/blockchain")
		.reply(200, loader.json("test/fixtures/client/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, loader.json("test/fixtures/client/configuration.json"));

	const result = await subject.transfer({
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

test("should add a signature if the sender public key is a multi-signature wallet", async () => {
	nock(/.+/)
		.get("/api/wallets/DBHbggggWbDUhdiqeh9HQ6b5Ryfit7Esek")
		.reply(200, loader.json(`test/fixtures/client/DKkBL5Mg9v1TPcKQrcUuW1VQrVFu8bh82Q.json`));

	const result = await subject.transfer({
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

test("#secondSignature", async () => {
	const result = await subject.secondSignature({
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

test("#delegateRegistration", async () => {
	const result = await subject.delegateRegistration({
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

test("#vote", async () => {
	const result = await subject.vote({
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

// test("#multiSignature", async () => {
// // 		const result = await subject.multiSignature({
// 			nonce: "1",
// 			signatory: new Signatories.Signatory(
// 				new Signatories.MnemonicSignatory({
// 					signingKey: identity.mnemonic,
// 					address: identity.address,
// 					publicKey: "publicKey",
// 					privateKey: "privateKey",
// 				}),
// 			),
// 			data: {
// 				publicKeys: [
// 					"03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
// 					"03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621ded",
// 				],
// 				min: 2,
// 			},
// 		});

// 		true.is(Transactions.TransactionFactory.fromJson(result.data()).verify());
// 	});
// });

test("#ipfs", async () => {
	const result = await subject.ipfs({
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

test("#multiPayment", async () => {
	const result = await subject.multiPayment({
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

test("#delegateResignation", async () => {
	const result = await subject.delegateResignation({
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

test("#htlcLock", async () => {
	const result = await subject.htlcLock({
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
			secretHash: "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454",
			expiration: {
				type: 1,
				value: Math.floor(Date.now() / 1000),
			},
		},
	});

	assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
});

test("#htlcClaim", async () => {
	const result = await subject.htlcClaim({
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
			lockTransactionId: "943c220691e711c39c79d437ce185748a0018940e1a4144293af9d05627d2eb4",
			unlockSecret: "c27f1ce845d8c29eebc9006be932b604fd06755521b1a8b0be4204c65377151a",
		},
	});

	assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
});

test("#htlcRefund", async () => {
	const result = await subject.htlcRefund({
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
			lockTransactionId: "943c220691e711c39c79d437ce185748a0018940e1a4144293af9d05627d2eb4",
		},
	});

	assert.true(Transactions.TransactionFactory.fromJson(result.data()).verify());
});

test("#estimateExpiration", async () => {
	nock(/.+/)
		.get("/api/blockchain")
		.reply(200, loader.json("test/fixtures/client/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, loader.json("test/fixtures/client/configuration.json"))
		.persist();

	assert.is(await subject.estimateExpiration(), "6795392");
});

test.run();
