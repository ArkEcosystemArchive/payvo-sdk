import { assert, describe, Mockery, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { Signatories } from "@payvo/sdk";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer } from "../test/mocking";
import { ProfileSetting, WalletData } from "./contracts";
import { Profile } from "./profile";
import { TransactionService } from "./wallet-transaction.service";
import { ExtendedSignedTransactionData } from "./signed-transaction.dto";

const deriveIdentity = async (signingKey) => ({
	signingKey,
	address: (await wallet.addressService().fromMnemonic(signingKey)).address,
	publicKey: (await wallet.publicKeyService().fromMnemonic(signingKey)).publicKey,
	privateKey: (await wallet.privateKeyService().fromMnemonic(signingKey)).privateKey,
});

let profile;
let wallet;
let subject;

describe("ARK", ({ afterEach, beforeAll, beforeEach, test }) => {
	beforeAll(() => {
		bootContainer();

		nock.disableNetConnect();
	});

	beforeEach(async () => {
		nock("https://ark-test.payvo.com:443")
			.get("/api/blockchain")
			.reply(200, require("../test/fixtures/client/blockchain.json"))
			.get("/api/node/configuration")
			.reply(200, require("../test/fixtures/client/configuration.json"))
			.get("/api/peers")
			.reply(200, require("../test/fixtures/client/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../test/fixtures/client/syncing.json"))
			// default wallet
			.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
			.reply(200, require("../test/fixtures/client/wallet.json"))
			.get("/api/wallets/030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd")
			.reply(200, require("../test/fixtures/client/wallet.json"))
			// second wallet
			.get("/api/wallets/022e04844a0f02b1df78dff2c7c4e3200137dfc1183dcee8fc2a411b00fd1877ce")
			.reply(200, require("../test/fixtures/client/wallet-2.json"))
			.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
			.reply(200, require("../test/fixtures/client/wallet-2.json"))
			// Musig wallet
			.get("/api/wallets/DML7XEfePpj5qDFb1SbCWxLRhzdTDop7V1")
			.reply(200, require("../test/fixtures/client/wallet-musig.json"))
			.get("/api/wallets/02cec9caeb855e54b71e4d60c00889e78107f6136d1f664e5646ebcb2f62dae2c6")
			.reply(200, require("../test/fixtures/client/wallet-musig.json"))
			.get("/transaction/a7245dcc720d3e133035cff04b4a14dbc0f8ff889c703c89c99f2f03e8f3c59d")
			.query(true)
			.reply(200, require("../test/fixtures/client/musig-transaction.json"))
			.get("/transaction/bb9004fa874b534905f9eff201150f7f982622015f33e076c52f1e945ef184ed")
			.query(true)
			.reply(200, () => ({ data: require("../test/fixtures/client/transactions.json").data[1] }))
			.persist();

		nock("https://lsk-test.payvo.com:443")
			.get("/api/v2/accounts")
			.query({ address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h" })
			.reply(404, { error: true, message: "Data not found" })
			.get("/api/v2/fees")
			.reply(200, {
				data: {
					feeEstimatePerByte: {
						low: 0,
						medium: 0,
						high: 0,
					},
					baseFeeById: {
						"5:0": "1000000000",
					},
					baseFeeByName: {
						"dpos:registerDelegate": "1000000000",
					},
					minFeePerByte: 1000,
				},
				meta: {
					lastUpdate: 1630294530,
					lastBlockHeight: 14467510,
					lastBlockId: "0ccc6783e26b8fbf030d9d23c6df35c2db58395b2d7aab9b61a703798425be40",
				},
			})
			.persist();

		profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
		profile.settings().set(ProfileSetting.Name, "John Doe");

		wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			network: "ark.devnet",
			mnemonic: identity.mnemonic,
		});

		subject = new TransactionService(wallet);
	});

	afterEach(() => {
		nock.cleanAll();
	});

	test("should sync", async () => {
		const musig = require("../test/fixtures/client/musig-transaction.json");
		nock("https://ark-test.payvo.com:443").get("/transactions").query(true).reply(200, [musig]).persist();
		await assert.resolves(() => subject.sync());
	});

	test("should add signature", async () => {
		nock("https://ark-test-musig.payvo.com:443")
			.post("/", {
				publicKey: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
				state: "pending",
			})
			.reply(200, {
				result: [
					{
						data: {
							id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
							signatures: [],
						},
						multisigAsset: {},
					},
				],
			})
			.post("/", {
				publicKey: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
				state: "ready",
			})
			.reply(200, {
				result: [
					{
						data: {
							id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
							signatures: [],
						},
						multisigAsset: {},
					},
				],
			})
			.post("/", {
				id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
			})
			.reply(200, {
				result: {
					data: { signatures: [] },
					multisigAsset: {},
				},
			})
			.post("/", ({ method }) => method === "store")
			.reply(200, {
				result: {
					id: "505e385d08e211b83fa6cf304ad67f42ddbdb364d767fd65354eb5a620b9380f",
				},
			})
			.persist();

		const identity1 = await deriveIdentity(
			"citizen door athlete item name various drive onion foster audit board myself",
		);
		const identity2 = await deriveIdentity(
			"upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
		);

		const id = await subject.signMultiSignature({
			nonce: "1",
			signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
			data: {
				publicKeys: [identity1.publicKey, identity2.publicKey],
				min: 1,
				senderPublicKey: "0205d9bbe71c343ac9a6a83a4344fd404c3534fc7349827097d0835d160bc2b896",
			},
		});

		await subject.sync();
		await subject.addSignature(id, new Signatories.Signatory(new Signatories.MnemonicSignatory(identity2)));

		assert.defined(subject.transaction(id));
	});

	test("should sign second signature", async () => {
		const input = {
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				mnemonic: "this is a top secret second mnemonic",
			},
		};
		const id = await subject.signSecondSignature(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
	});

	test("should sign multi signature registration", async () => {
		const identity1 = await deriveIdentity(
			"upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
		);
		const identity2 = await deriveIdentity(
			"citizen door athlete item name various drive onion foster audit board myself",
		);
		const identity3 = await deriveIdentity(
			"nuclear anxiety mandate board property fade chief mule west despair photo fiber",
		);

		const id = await subject.signMultiSignature({
			nonce: "1",
			signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
			data: {
				publicKeys: [identity1.publicKey, identity2.publicKey, identity3.publicKey],
				min: 2,
				senderPublicKey: identity1.publicKey,
			},
		});

		assert.string(id);
		assert.containKey(subject.waitingForOtherSignatures(), id);
		assert.instance(subject.waitingForOtherSignatures()[id], ExtendedSignedTransactionData);
		assert.false(subject.canBeSigned(id));
	});

	test("should sign ipfs", async () => {
		const input = {
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				hash: "QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9w",
			},
		};
		const id = await subject.signIpfs(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
	});

	test("should sign multi payment", async () => {
		const input = {
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
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
			},
		};
		const id = await subject.signMultiPayment(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
	});

	test("should sign delegate resignation", async () => {
		const input = {
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
		};
		const id = await subject.signDelegateResignation(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
	});

	test("should sign htlc lock", async () => {
		const input = {
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
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
					value: 1607523002,
				},
			},
		};
		const id = await subject.signHtlcLock(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
	});

	test("should sign htlc claim", async () => {
		const input = {
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				lockTransactionId: "943c220691e711c39c79d437ce185748a0018940e1a4144293af9d05627d2eb4",
				unlockSecret: "c27f1ce845d8c29eebc9006be932b604fd06755521b1a8b0be4204c65377151a",
			},
		};
		const id = await subject.signHtlcClaim(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
	});

	test("should sign htlc refund", async () => {
		const input = {
			nonce: "1",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				lockTransactionId: "943c220691e711c39c79d437ce185748a0018940e1a4144293af9d05627d2eb4",
			},
		};
		const id = await subject.signHtlcRefund(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
	});

	test("#transaction lifecycle", async () => {
		const realHash = "819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef";

		const input = {
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		};
		const id = await subject.signTransfer(input);
		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.defined(subject.transaction(id));
		assert.not.containKey(subject.waitingForOurSignature(), id);
		assert.not.containKey(subject.waitingForOtherSignatures(), id);
		assert.true(subject.hasBeenSigned(id));
		assert.false(subject.hasBeenBroadcasted(id));
		assert.false(subject.hasBeenConfirmed(id));

		nock("https://ark-test.payvo.com:443")
			.post("/api/transactions")
			.reply(201, {
				data: {
					accept: [realHash],
					broadcast: [],
					excess: [],
					invalid: [],
				},
				errors: {},
			})
			.get(`/api/transactions/${realHash}`)
			.reply(200, { data: { confirmations: 51 } });

		assert.equal(await subject.broadcast(id), {
			accepted: [realHash],
			rejected: [],
			errors: {},
		});

		assert.containKey(subject.signed(), id);
		assert.containKey(subject.broadcasted(), id);
		assert.true(subject.isAwaitingConfirmation(id));
		assert.true(subject.hasBeenSigned(id));
		assert.true(subject.hasBeenBroadcasted(id));
		assert.false(subject.hasBeenConfirmed(id));
		assert.defined(subject.transaction(id));

		await subject.confirm(id);

		await assert.rejects(() => subject.confirm(null));

		assert.not.containKey(subject.signed(), id);
		assert.not.containKey(subject.broadcasted(), id);
		assert.false(subject.isAwaitingConfirmation(id));
	});

	test("#pending", async () => {
		const input = {
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		};
		const id = await subject.signTransfer(input);
		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
		assert.containKey(subject.pending(), id);
	});

	test("should fail when using malformed transaction ID", async () => {
		assert.throws(() => subject.transaction());
	});

	test("should fail retrieving public key if wallet is lacking a public key", async () => {
		const walletPublicKeyMock = Mockery.stub(wallet, "publicKey").returnValue(undefined);
		assert.throws(() => subject.getPublicKey());
		walletPublicKeyMock.restore();
	});

	test("#dump", async () => {
		const input = {
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		};

		const id = await subject.signTransfer(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);

		assert.undefined(wallet.data().get(WalletData.SignedTransactions));
		subject.dump();
		assert.containKey(wallet.data().get(WalletData.SignedTransactions), id);
	});

	test("#restore", async () => {
		const input = {
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		};

		const id = await subject.signTransfer(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);

		assert.undefined(wallet.data().get(WalletData.SignedTransactions));

		subject.dump();
		subject.restore();

		assert.containKey(wallet.data().get(WalletData.SignedTransactions), id);

		const mockedUndefinedStorage = Mockery.stub(wallet.data(), "get").returnValue(undefined);
		subject.restore();
		mockedUndefinedStorage.restore();
		assert.containKey(wallet.data().get(WalletData.SignedTransactions), id);
	});

	test("sign a multisig transaction awaiting other signatures", async () => {
		nock("https://ark-test.payvo.com:443")
			.post("/")
			.reply(200, { result: [require("../test/fixtures/client/musig-transaction.json")] })
			.post("/")
			.reply(200, { result: [] })
			.persist();

		const identity1 = await deriveIdentity(
			"upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
		);
		const identity2 = await deriveIdentity(
			"citizen door athlete item name various drive onion foster audit board myself",
		);

		const id = await subject.signMultiSignature({
			nonce: "1",
			signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
			data: {
				publicKeys: [identity1.publicKey, identity2.publicKey],
				min: 2,
				senderPublicKey: identity1.publicKey,
			},
		});

		assert.defined(subject.transaction(id));
		assert.containKey(subject.pending(), id);
		assert.containKey(subject.waitingForOtherSignatures(), id);
		assert.false(subject.isAwaitingSignatureByPublicKey(id, identity1.publicKey));
		assert.true(subject.isAwaitingSignatureByPublicKey(id, identity2.publicKey));
	});

	test("should sync multisig transaction awaiting our signature", async () => {
		nock("https://ark-test-musig.payvo.com:443")
			.post("/")
			.reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-our.json")] })
			.post("/")
			.reply(200, { result: [] })
			.persist();

		const id = "a7245dcc720d3e133035cff04b4a14dbc0f8ff889c703c89c99f2f03e8f3c59d";

		await subject.sync();
		assert.containKey(subject.waitingForOurSignature(), id);
	});

	test("should await signature by public ip", async () => {
		nock("https://ark-test-musig.payvo.com:443")
			.post("/")
			.reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-signature.json")] })
			.post("/")
			.reply(200, { result: [] })
			.persist();

		const id = "46343c36bf7497b68e14d4c0fd713e41a737841b6a858fa41ef0eab6c4647938";

		await subject.sync();
		const mockNeedsWalletSignature = Mockery.stub(
			wallet.coin().multiSignature(),
			"needsWalletSignature",
		).returnValue(true);

		assert.true(
			subject.isAwaitingSignatureByPublicKey(
				id,
				"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
			),
		);
		mockNeedsWalletSignature.restore();
	});

	test("transaction should not await any signatures", async () => {
		nock("https://ark-test.payvo.com:443")
			.post("/")
			.reply(200, { result: [] })
			.post("/")
			.reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-none.json")] })
			.persist();

		const id = "46343c36bf7497b68e14d4c0fd713e41a737841b6a858fa41ef0eab6c4647938";

		await subject.sync();
		assert.throws(() =>
			subject.isAwaitingSignatureByPublicKey(
				id,
				"030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
			),
		);
	});

	test("should broadcast transaction", async () => {
		nock("https://ark-test.payvo.com:443")
			.post("/api/transactions")
			.reply(201, {
				data: {
					accept: ["819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef"],
					broadcast: [],
					excess: [],
					invalid: [],
				},
				errors: {},
			})
			.get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
			.reply(200, { data: { confirmations: 1 } });

		const input = {
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		};

		const id = await subject.signTransfer(input);
		assert.defined(subject.transaction(id));
		await subject.broadcast(id);
		assert.containKey(subject.broadcasted(), id);
		assert.defined(subject.transaction(id));
	});

	test("should broadcast a transfer and confirm it", async () => {
		nock("https://ark-test.payvo.com:443")
			.post("/api/transactions")
			.reply(201, {
				data: {
					accept: ["819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef"],
					broadcast: [],
					excess: [],
					invalid: [],
				},
				errors: {},
			})
			.get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
			.reply(200, { data: { confirmations: 51 } });

		const input = {
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		};

		const id = await subject.signTransfer(input);
		assert.defined(subject.transaction(id));
		await subject.broadcast(id);
		assert.containKey(subject.broadcasted(), id);
		await subject.confirm(id);
		assert.defined(subject.transaction(id));
		assert.true(subject.hasBeenConfirmed(id));
	});

	test("should broadcast multisignature transaction", async () => {
		nock("https://ark-test-musig.payvo.com:443")
			.post("/")
			.reply(200, { result: [require("../test/fixtures/client/multisig-transaction-awaiting-none.json")] })
			.post("/")
			.reply(200, { result: [] });

		nock("https://ark-test.payvo.com:443")
			.post("/transaction")
			.reply(201, {
				data: {
					accept: ["4b867a3aa16a1a298cee236a3a907b8bc50e139199525522bfa88b5a9bb11a78"],
					broadcast: [],
					excess: [],
					invalid: [],
				},
				errors: {},
			})
			.persist();

		const identity1 = await deriveIdentity(
			"upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
		);
		const identity2 = await deriveIdentity(
			"citizen door athlete item name various drive onion foster audit board myself",
		);

		const id = await subject.signMultiSignature({
			nonce: "1",
			signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
			data: {
				publicKeys: [identity1.publicKey, identity2.publicKey],
				min: 2,
			},
		});

		const isMultiSignatureRegistration = Mockery.stub(subject.transaction(id), "isMultiSignatureRegistration");

		const mockedFalseMultisignatureRegistration = isMultiSignatureRegistration.returnValue(false);
		assert.defined(subject.transaction(id));
		assert.containKey(subject.pending(), id);
		assert.true(subject.transaction(id).usesMultiSignature());

		await subject.broadcast(id);
		assert.containKey(subject.waitingForOtherSignatures(), id);

		const mockedFalseMultisignature = isMultiSignatureRegistration.returnValue(false);
		await subject.broadcast(id);
		assert.defined(subject.transaction(id));

		mockedFalseMultisignatureRegistration.restore();
		mockedFalseMultisignature.restore();
	});

	test("should broadcast multisignature registration", async () => {
		nock("https://ark-test-musig.payvo.com:443")
			.post("/")
			.reply(200, { result: [require("../test/fixtures/client/musig-transaction.json")] });

		nock("https://ark-test.payvo.com:443")
			.post("/")
			.reply(200, { result: [] })
			.post("/transaction")
			.reply(201, {
				data: {
					accept: ["5d7b213905c3bf62bc233b7f1e211566b1fd7aecad668ed91bb8202b3f35d890"],
					broadcast: [],
					excess: [],
					invalid: [],
				},
				errors: {},
			})
			.persist();

		const identity1 = await deriveIdentity(
			"upset boat motor few ketchup merge punch gesture lecture piano neutral uniform",
		);
		const identity2 = await deriveIdentity(
			"citizen door athlete item name various drive onion foster audit board myself",
		);

		const id = await subject.signMultiSignature({
			nonce: "1",
			signatory: new Signatories.Signatory(new Signatories.MnemonicSignatory(identity1)),
			data: {
				publicKeys: [identity1.publicKey, identity2.publicKey],
				min: 2,
			},
		});

		assert.defined(subject.transaction(id));
		assert.containKey(subject.pending(), id);
		assert.true(subject.transaction(id).usesMultiSignature());
		assert.true(subject.transaction(id).isMultiSignatureRegistration());

		await subject.broadcast(id);
		assert.containKey(subject.waitingForOtherSignatures(), id);
	});

	test.skip("#confirm", async () => {
		nock("https://ark-test.payvo.com:443")
			.post("/api/transactions")
			.reply(201, {
				data: {
					accept: ["819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef"],
					broadcast: [],
					excess: [],
					invalid: [],
				},
				errors: {},
			})
			.get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
			.reply(200, { data: { confirmations: 0 } });

		const input = {
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					publicKey: "publicKey",
					privateKey: "privateKey",
				}),
			),
			data: {
				amount: 1,
				to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		};

		const id = await subject.signTransfer(input);

		assert.object(subject.broadcast(id));
		assert.defined(subject.transaction(id));

		// Uncofirmed
		await subject.confirm(id);
		assert.true(subject.isAwaitingConfirmation(id));

		// Invalid id
		//@ts-ignore
		await assert.rejects(() => subject.confirm(null));

		// Handle wallet client error. Should return false
		const walletClientTransactionMock = Mockery.stub(wallet.client(), "transaction").callsFake(() => {
			throw new Error("transaction error");
		});

		assert.is(await subject.confirm(id), false);
		walletClientTransactionMock.restore();

		// Confirmed
		nock.cleanAll();
		nock("https://ark-test.payvo.com:443")
			.get("/api/transactions/819aa9902c194ce2fd48ae8789fa1b5273698c02b7ad91d0d561742567fd4cef")
			.reply(200, { data: { confirmations: 51 } });

		await subject.confirm(id);
		assert.false(subject.isAwaitingConfirmation(id));
	});

	test("should throw if a transaction is retrieved that does not exist", async () => {
		assert.throws(() => subject.transaction("id"), /could not be found/);
	});
});

describe("Shared", ({ afterEach, beforeAll, beforeEach, each }) => {
	beforeAll(() => {
		bootContainer();

		nock.disableNetConnect();
	});

	beforeEach(async () => {
		nock("https://ark-test.payvo.com:443")
			.get("/api/blockchain")
			.reply(200, require("../test/fixtures/client/blockchain.json"))
			.get("/api/node/configuration")
			.reply(200, require("../test/fixtures/client/configuration.json"))
			.get("/api/peers")
			.reply(200, require("../test/fixtures/client/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../test/fixtures/client/syncing.json"))
			// default wallet
			.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
			.reply(200, require("../test/fixtures/client/wallet.json"))
			.get("/api/wallets/030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd")
			.reply(200, require("../test/fixtures/client/wallet.json"))
			// second wallet
			.get("/api/wallets/022e04844a0f02b1df78dff2c7c4e3200137dfc1183dcee8fc2a411b00fd1877ce")
			.reply(200, require("../test/fixtures/client/wallet-2.json"))
			.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
			.reply(200, require("../test/fixtures/client/wallet-2.json"))
			// Musig wallet
			.get("/api/wallets/DML7XEfePpj5qDFb1SbCWxLRhzdTDop7V1")
			.reply(200, require("../test/fixtures/client/wallet-musig.json"))
			.get("/api/wallets/02cec9caeb855e54b71e4d60c00889e78107f6136d1f664e5646ebcb2f62dae2c6")
			.reply(200, require("../test/fixtures/client/wallet-musig.json"))
			.get("/transaction/a7245dcc720d3e133035cff04b4a14dbc0f8ff889c703c89c99f2f03e8f3c59d")
			.query(true)
			.reply(200, require("../test/fixtures/client/musig-transaction.json"))
			.get("/transaction/bb9004fa874b534905f9eff201150f7f982622015f33e076c52f1e945ef184ed")
			.query(true)
			.reply(200, () => ({ data: require("../test/fixtures/client/transactions.json").data[1] }))
			.persist();

		nock("https://lsk-test.payvo.com:443")
			.get("/api/v2/accounts")
			.query({ address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h" })
			.reply(404, { error: true, message: "Data not found" })
			.get("/api/v2/fees")
			.reply(200, {
				data: {
					feeEstimatePerByte: {
						low: 0,
						medium: 0,
						high: 0,
					},
					baseFeeById: {
						"5:0": "1000000000",
					},
					baseFeeByName: {
						"dpos:registerDelegate": "1000000000",
					},
					minFeePerByte: 1000,
				},
				meta: {
					lastUpdate: 1630294530,
					lastBlockHeight: 14467510,
					lastBlockId: "0ccc6783e26b8fbf030d9d23c6df35c2db58395b2d7aab9b61a703798425be40",
				},
			})
			.persist();

		profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });
		profile.settings().set(ProfileSetting.Name, "John Doe");

		wallet = await profile.walletFactory().fromMnemonicWithBIP39({
			coin: "ARK",
			network: "ark.devnet",
			mnemonic: identity.mnemonic,
		});

		subject = new TransactionService(wallet);
	});

	afterEach(() => {
		nock.cleanAll();
	});

    each("should create a transfer for %s", async ({ coin, network, input }) => {
        const subject = new TransactionService(
            await profile.walletFactory().fromMnemonicWithBIP39({
                coin,
                network,
                mnemonic: identity.mnemonic,
            }),
        );

        const id = await subject.signTransfer(input);

        assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
		assert.is(subject.transaction(id).sender(), input.signatory.address());
		assert.is(subject.transaction(id).recipient(), input.data.to);
		assert.true(subject.transaction(id).isTransfer());
		assert.false(subject.transaction(id).isSecondSignature());
		assert.false(subject.transaction(id).isDelegateRegistration());
		assert.false(subject.transaction(id).isVoteCombination());
		assert.false(subject.transaction(id).isVote());
		assert.false(subject.transaction(id).isUnvote());
		assert.false(subject.transaction(id).isMultiSignatureRegistration());
		assert.false(subject.transaction(id).isIpfs());
		assert.false(subject.transaction(id).isMultiPayment());
		assert.false(subject.transaction(id).isDelegateResignation());
		assert.false(subject.transaction(id).isHtlcLock());
		assert.false(subject.transaction(id).isHtlcClaim());
		assert.false(subject.transaction(id).isHtlcRefund());
		assert.false(subject.transaction(id).isMagistrate());
		assert.false(subject.transaction(id).usesMultiSignature());
	}, [
        {
            coin: "ARK",
            network: "ark.devnet",
            input: {
                signatory: new Signatories.Signatory(
                    new Signatories.MnemonicSignatory({
                        signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                        address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                        publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                        privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                    }),
                ),
                data: {
                    amount: 1,
                    to: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
                },
            },
        },
        {
            coin: "LSK",
            network: "lsk.testnet",
            input: {
                signatory: new Signatories.Signatory(
                    new Signatories.MnemonicSignatory({
                        signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
                        address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                        publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
                        privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
                    }),
                ),
                data: {
                    amount: 1,
                    to: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
                },
            },
        },
    ]);

	each("should create a delegate registration for %s", async ({ coin, network, input }) => {
		const subject = new TransactionService(
			await profile.walletFactory().fromMnemonicWithBIP39({
				coin,
				network,
				mnemonic: identity.mnemonic,
			}),
		);

		const id = await subject.signDelegateRegistration(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
		assert.is(subject.transaction(id).sender(), input.signatory.address());
		assert.undefined(subject.transaction(id).recipient());
		assert.false(subject.transaction(id).isTransfer());
		assert.false(subject.transaction(id).isSecondSignature());
		assert.true(subject.transaction(id).isDelegateRegistration());
		assert.false(subject.transaction(id).isVoteCombination());
		assert.false(subject.transaction(id).isVote());
		assert.false(subject.transaction(id).isUnvote());
		assert.false(subject.transaction(id).isMultiSignatureRegistration());
		assert.false(subject.transaction(id).isIpfs());
		assert.false(subject.transaction(id).isMultiPayment());
		assert.false(subject.transaction(id).isDelegateResignation());
		assert.false(subject.transaction(id).isHtlcLock());
		assert.false(subject.transaction(id).isHtlcClaim());
		assert.false(subject.transaction(id).isHtlcRefund());
		assert.false(subject.transaction(id).isMagistrate());
		assert.false(subject.transaction(id).usesMultiSignature());
	}, [
		{
			coin: "ARK",
			network: "ark.devnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					username: "johndoe",
				},
			},
		},
		{
			coin: "LSK",
			network: "lsk.testnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
						privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
					}),
				),
				data: {
					username: "johndoe",
				},
			},
		},
	]);

	each("should create a vote for %s", async ({ coin, network, input }) => {
		const subject = new TransactionService(
			await profile.walletFactory().fromMnemonicWithBIP39({
				coin,
				network,
				mnemonic: identity.mnemonic,
			}),
		);

		const id = await subject.signVote(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
		assert.is(subject.transaction(id).sender(), input.signatory.address());
		assert.undefined(subject.transaction(id).recipient());
		assert.false(subject.transaction(id).isTransfer());
		assert.false(subject.transaction(id).isSecondSignature());
		assert.false(subject.transaction(id).isDelegateRegistration());
		assert.false(subject.transaction(id).isVoteCombination());
		assert.true(subject.transaction(id).isVote());
		assert.false(subject.transaction(id).isUnvote());
		assert.false(subject.transaction(id).isMultiSignatureRegistration());
		assert.false(subject.transaction(id).isIpfs());
		assert.false(subject.transaction(id).isMultiPayment());
		assert.false(subject.transaction(id).isDelegateResignation());
		assert.false(subject.transaction(id).isHtlcLock());
		assert.false(subject.transaction(id).isHtlcClaim());
		assert.false(subject.transaction(id).isHtlcRefund());
		assert.false(subject.transaction(id).isMagistrate());
		assert.false(subject.transaction(id).usesMultiSignature());
	}, [
		{
			coin: "ARK",
			network: "ark.devnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
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
					unvotes: [],
				},
			},
		},
		{
			coin: "LSK",
			network: "lsk.testnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
						privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
					}),
				),
				data: {
					votes: [
						{
							amount: 10,
							id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						},
					],
					unvotes: [],
				},
			},
		},
	]);

	each("should create an unvote for %s", async ({ coin, network, input }) => {
		const subject = new TransactionService(
			await profile.walletFactory().fromMnemonicWithBIP39({
				coin,
				network,
				mnemonic: identity.mnemonic,
			}),
		);

		const id = await subject.signVote(input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
		assert.is(subject.transaction(id).sender(), input.signatory.address());
		assert.undefined(subject.transaction(id).recipient());
		assert.false(subject.transaction(id).isTransfer());
		assert.false(subject.transaction(id).isSecondSignature());
		assert.false(subject.transaction(id).isDelegateRegistration());
		assert.false(subject.transaction(id).isVoteCombination());
		assert.false(subject.transaction(id).isVote());
		assert.true(subject.transaction(id).isUnvote());
		assert.false(subject.transaction(id).isMultiSignatureRegistration());
		assert.false(subject.transaction(id).isIpfs());
		assert.false(subject.transaction(id).isMultiPayment());
		assert.false(subject.transaction(id).isDelegateResignation());
		assert.false(subject.transaction(id).isHtlcLock());
		assert.false(subject.transaction(id).isHtlcClaim());
		assert.false(subject.transaction(id).isHtlcRefund());
		assert.false(subject.transaction(id).isMagistrate());
		assert.false(subject.transaction(id).usesMultiSignature());
    }, [
		{
			coin: "ARK",
			network: "ark.devnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
						publicKey: "publicKey",
						privateKey: "privateKey",
					}),
				),
				data: {
					votes: [],
					unvotes: [
						{
							id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
							amount: 0,
						},
					],
				},
			},
		},
		{
			coin: "LSK",
			network: "lsk.testnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
						privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
					}),
				),
				data: {
					votes: [],
					unvotes: [
						{
							amount: 10,
							id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						},
					],
				},
			},
		},
	]);

	each("should create a vote combination for %s", async ({ dataset }) => {
		const subject = new TransactionService(
			await profile.walletFactory().fromMnemonicWithBIP39({
				coin: dataset.coin,
				network: dataset.network,
				mnemonic: identity.mnemonic,
			}),
		);

		const id = await subject.signVote(dataset.input);

		assert.string(id);
		assert.containKey(subject.signed(), id);
		assert.instance(subject.transaction(id), ExtendedSignedTransactionData);
		assert.is(subject.transaction(id).sender(), input.signatory.address());
		assert.undefined(subject.transaction(id).recipient());
		assert.false(subject.transaction(id).isTransfer());
		assert.false(subject.transaction(id).isSecondSignature());
		assert.false(subject.transaction(id).isDelegateRegistration());
		assert.true(subject.transaction(id).isVoteCombination());
		assert.true(subject.transaction(id).isVote());
		assert.true(subject.transaction(id).isUnvote());
		assert.false(subject.transaction(id).isMultiSignatureRegistration());
		assert.false(subject.transaction(id).isIpfs());
		assert.false(subject.transaction(id).isMultiPayment());
		assert.false(subject.transaction(id).isDelegateResignation());
		assert.false(subject.transaction(id).isHtlcLock());
		assert.false(subject.transaction(id).isHtlcClaim());
		assert.false(subject.transaction(id).isHtlcRefund());
		assert.false(subject.transaction(id).isMagistrate());
		assert.false(subject.transaction(id).usesMultiSignature());
	}, [
		{
			coin: "ARK",
			network: "ark.devnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
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
							id: "03bbfb43ecb5a54a1e227bb37b5812b5321213838d376e2b455b6af78442621dec",
							amount: 0,
						},
					],
				},
			},
		},
		{
			coin: "LSK",
			network: "lsk.testnet",
			input: {
				signatory: new Signatories.Signatory(
					new Signatories.MnemonicSignatory({
						signingKey: "bomb open frame quit success evolve gain donate prison very rent later",
						address: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						publicKey: "39b49ead71b16c0b0330a6ba46c57183819936bfdf789dfd2452df4dc04f5a2a",
						privateKey: "e2511a6022953eb399fbd48f84619c04c894f735aee107b02a7690075ae67617",
					}),
				),
				data: {
					votes: [
						{
							amount: 10,
							id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						},
					],
					unvotes: [
						{
							amount: 10,
							id: "lskw6h7zzen4f7n8k4ntwd9qtv62gexzv2rh7cb6h",
						},
					],
				},
			},
		},
	]);
});

test.run();
