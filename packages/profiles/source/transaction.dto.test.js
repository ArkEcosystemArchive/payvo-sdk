import { assert, describe, Mockery, sinon, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";
import nock from "nock";

import { data as secondWallet } from "../test/fixtures/wallets/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json";
import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { ProfileSetting } from "./contracts";
import { Profile } from "./profile";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ExtendedConfirmedTransactionData } from "./transaction.dto";

const createSubject = (wallet, properties, klass) => {
	let meta = "some meta";

	return new klass(wallet, {
		id: () => "transactionId",
		blockId: () => "transactionBlockId",
		bridgechainId: () => "bridgechainId",
		type: () => "some type",
		timestamp: () => undefined,
		confirmations: () => BigNumber.make(20),
		sender: () => "sender",
		recipient: () => "recipient",
		memo: () => "memo",
		recipients: () => [],
		amount: () => BigNumber.make(18e8, 8),
		fee: () => BigNumber.make(2e8, 8),
		asset: () => ({}),
		inputs: () => [],
		outputs: () => [],
		isSent: () => true,
		toObject: () => ({}),
		getMeta: () => meta,
		setMeta: (key, value) => {
			meta = value;
		},
		...(properties || {}),
	});
};

let subject;
let profile;
let wallet;

let liveSpy;
let testSpy;

const beforeEachCallback = async () => {
	bootContainer({ flush: true });

	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/delegates")
		.reply(200, require("../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../test/fixtures/client/delegates-2.json"))
		.get("/api/ipfs/QmR45FmbVVrixReBwJkhEKde2qwHYaQzGxu4ZoDeswuF9c")
		.reply(200, { data: "ipfs-content" })
		// CryptoCompare
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
		.get("/data/histoday")
		.query(true)
		.reply(200, require("../test/fixtures/markets/cryptocompare/historical.json"))
		.persist();

	profile = new Profile({ id: "profile-id", name: "name", avatar: "avatar", data: "" });

	profile.settings().set(ProfileSetting.Name, "John Doe");
	profile.settings().set(ProfileSetting.ExchangeCurrency, "BTC");
	profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

	wallet = await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	liveSpy = Mockery.stub(wallet.network(), "isLive").returnValue(true);
	testSpy = Mockery.stub(wallet.network(), "isTest").returnValue(false);
};

const afterEachCallback = () => {
	liveSpy.restore();
	testSpy.restore();
};

describe("Transaction", ({ afterEach, beforeEach, test }) => {
	beforeEach(async () => {
		await beforeEachCallback();

		subject = createSubject(wallet, undefined, ExtendedConfirmedTransactionData);
	});

	afterEach(() => {
		afterEachCallback();
	});

	test("should have an explorer link", () => {
		assert.is(subject.explorerLink(), "https://dexplorer.ark.io/transaction/transactionId");
	});

	test("should have an explorer block link", () => {
		assert.is(subject.explorerLinkForBlock(), "https://dexplorer.ark.io/block/transactionBlockId");
	});

	test("should have an explorer block link for undefined block", () => {
		subject = createSubject(
			wallet,
			{
				...subject,
				blockId: () => undefined,
			},
			ExtendedConfirmedTransactionData,
		);

		assert.undefined(subject.explorerLinkForBlock());
	});

	test("should have a type", () => {
		assert.is(subject.type(), "some type");
	});

	test("should have a timestamp", () => {
		assert.undefined(subject.timestamp());
	});

	test("should have confirmations", () => {
		assert.equal(subject.confirmations(), BigNumber.make(20));
	});

	test("should have a sender", () => {
		assert.is(subject.sender(), "sender");
	});

	test("should have a recipient", () => {
		assert.is(subject.recipient(), "recipient");
	});

	test("should have a recipients", () => {
		assert.instance(subject.recipients(), Array);
		assert.is(subject.recipients().length, 0);
	});

	test("should have an amount", () => {
		assert.equal(subject.amount(), 18);
	});

	test.skip("should have a converted amount", async () => {
		subject = createSubject(
			wallet,
			{
				timestamp: () => DateTime.make(),
				amount: () => BigNumber.make(10e8, 8),
			},
			ExtendedConfirmedTransactionData,
		);

		await container.get(Identifiers.ExchangeRateService).syncAll(profile, "DARK");

		assert.is(subject.convertedAmount(), 0.0005048);
	});

	test("should have a default converted amount", () => {
		assert.equal(subject.convertedAmount(), 0);
	});

	test("should have a fee", () => {
		assert.equal(subject.fee(), 2);
	});

	test.skip("should have a converted fee", async () => {
		subject = createSubject(
			wallet,
			{
				timestamp: () => DateTime.make(),
				fee: () => BigNumber.make(10e8, 8),
			},
			ExtendedConfirmedTransactionData,
		);

		await container.get(Identifiers.ExchangeRateService).syncAll(profile, "DARK");

		assert.is(subject.convertedFee(), 0.0005048);
	});

	test("should have a default converted fee", () => {
		assert.equal(subject.convertedFee(), 0);
	});

	test("#toObject", () => {
		subject = createSubject(
			wallet,
			{
				toObject: () => ({
					key: "value",
				}),
			},
			ExtendedConfirmedTransactionData,
		);

		assert.equal(subject.toObject(), {
			key: "value",
		});
	});

	test("#memo", () => {
		subject = createSubject(
			wallet,
			{
				memo: () => "memo",
			},
			ExtendedConfirmedTransactionData,
		);

		assert.is(subject.memo(), "memo");
	});

	test("#inputs", () => {
		subject = createSubject(
			wallet,
			{
				inputs: () => [{}, {}, {}],
			},
			ExtendedConfirmedTransactionData,
		);

		assert.length(subject.inputs(), 3);
	});

	test("#outputs", () => {
		subject = createSubject(
			wallet,
			{
				outputs: () => [{}, {}, {}],
			},
			ExtendedConfirmedTransactionData,
		);

		assert.length(subject.outputs(), 3);
	});

	test("should not throw if transaction type does not have memo", () => {
		const subject = createSubject(
			wallet,
			{
				memo: undefined,
			},
			ExtendedConfirmedTransactionData,
		);

		assert.not.throws(() => subject.memo());
		assert.undefined(subject.memo());
	});

	test("#hasPassed", () => {
		subject = createSubject(
			wallet,
			{
				hasPassed: () => true,
			},
			ExtendedConfirmedTransactionData,
		);

		assert.true(subject.hasPassed());
	});

	test("coin", () => {
		assert.is(subject.coin(), wallet.coin());
	});

	test("#hasFailed", () => {
		subject = createSubject(
			wallet,
			{
				hasFailed: () => true,
			},
			ExtendedConfirmedTransactionData,
		);

		assert.true(subject.hasFailed());
	});

	test("#isReturn", () => {
		subject = createSubject(
			wallet,
			{
				isReturn: () => true,
			},
			ExtendedConfirmedTransactionData,
		);

		assert.true(subject.isReturn());
	});

	test("#getMeta | #setMeta", () => {
		const getMeta = sinon.spy();
		const setMeta = sinon.spy();

		subject = createSubject(wallet, { getMeta, setMeta }, ExtendedConfirmedTransactionData);

		subject.getMeta("key");
		subject.setMeta("key", "value");

		assert.true(getMeta.callCount > 0);
		assert.true(setMeta.callCount > 0);
	});

	test("should not have a memo", () => {
		assert.is(subject.memo(), "memo");
	});

	test("should have a total for sent", () => {
		assert.equal(subject.total(), 20);
	});

	test("should have a total for unsent", () => {
		// @ts-ignore
		subject = new ExtendedConfirmedTransactionData(wallet, {
			amount: () => BigNumber.make(18e8, 8),
			fee: () => BigNumber.make(2e8, 8),
			isSent: () => false,
			isMultiPayment: () => false,
		});
		assert.equal(subject.total(), 18);
	});

	test("should calculate total amount of the multi payments for unsent", () => {
		// @ts-ignore
		subject = new ExtendedConfirmedTransactionData(wallet, {
			amount: () => BigNumber.make(18e8, 8),
			fee: () => BigNumber.make(2e8, 8),
			isSent: () => false,
			isMultiPayment: () => true,
			recipients: () => [
				{
					address: wallet.address(),
					amount: BigNumber.make(5e8, 8),
				},
				{
					address: secondWallet.address,
					amount: BigNumber.make(6e8, 8),
				},
				{
					address: wallet.address(),
					amount: BigNumber.make(7e8, 8),
				},
			],
		});

		assert.equal(subject.amount(), 18);
		assert.equal(subject.total(), 12);
	});

	test.skip("should have a converted total", async () => {
		subject = createSubject(
			wallet,
			{
				timestamp: () => DateTime.make(),
				amount: () => BigNumber.make(10e8, 8),
				fee: () => BigNumber.make(5e8, 8),
			},
			ExtendedConfirmedTransactionData,
		);

		await container.get(Identifiers.ExchangeRateService).syncAll(profile, "DARK");

		assert.is(subject.convertedTotal(), 0.0007572);
	});

	test("should have a default converted total", () => {
		assert.equal(subject.convertedTotal(), 0);
	});

	test("should have meta", () => {
		assert.equal(subject.getMeta("someKey"), "some meta");
	});

	test("should change meta", () => {
		subject.setMeta("someKey", "another meta");
		assert.equal(subject.getMeta("someKey"), "another meta");
	});

	const data = [
		["isMagistrate"],
		["isDelegateRegistration"],
		["isDelegateResignation"],
		["isHtlcClaim"],
		["isHtlcLock"],
		["isHtlcRefund"],
		["isIpfs"],
		["isMultiPayment"],
		["isMultiSignatureRegistration"],
		["isSecondSignature"],
		["isTransfer"],
		["isVote"],
		["isUnvote"],
		["hasPassed"],
		["hasFailed"],
		["isConfirmed"],
		["isSent"],
		["isReceived"],
		["isTransfer"],
		["isVoteCombination"],
	];

	const dummyTransactionData = {
		isMagistrate: () => false,
		isDelegateRegistration: () => false,
		isDelegateResignation: () => false,
		isHtlcClaim: () => false,
		isHtlcLock: () => false,
		isHtlcRefund: () => false,
		isIpfs: () => false,
		isMultiPayment: () => false,
		isMultiSignatureRegistration: () => false,
		isSecondSignature: () => false,
		isTransfer: () => false,
		isVote: () => false,
		isUnvote: () => false,
		hasPassed: () => false,
	};

	// it.each(data)(`should delegate %p correctly`, (functionName) => {
	//     // @ts-ignore
	//     const transactionData = new ExtendedConfirmedTransactionData(wallet, {
	//         ...dummyTransactionData,
	//         [String(functionName)]: () => true,
	//     });
	//     assert.truthy(transactionData[functionName.toString()]());
	// });
});

// describe("DelegateRegistrationData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				username: () => "username",
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#username", () => {
// 		assert.is(subject.username(), "username");
// 	});
// });

// describe("DelegateResignationData", ({ afterEach, beforeEach, test }) => {
// 	test.before.each(() => (subject = createSubject(wallet, undefined, ExtendedConfirmedTransactionData)));

// 	test("#id", () => {
// 		assert.is(subject.id(), "transactionId");
// 	});
// });

// describe("HtlcClaimData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				lockTransactionId: () => "lockTransactionId",
// 				unlockSecret: () => "unlockSecret",
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#lockTransactionId", () => {
// 		assert.is(subject.lockTransactionId(), "lockTransactionId");
// 	});

// 	test("#unlockSecret", () => {
// 		assert.is(subject.unlockSecret(), "unlockSecret");
// 	});
// });

// describe("HtlcLockData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				secretHash: () => "secretHash",
// 				expirationType: () => 5,
// 				expirationValue: () => 3,
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#secretHash", () => {
// 		assert.is(subject.secretHash(), "secretHash");
// 	});

// 	test("#expirationType", () => {
// 		assert.is(subject.expirationType(), 5);
// 	});

// 	test("#expirationValue", () => {
// 		assert.is(subject.expirationValue(), 3);
// 	});
// });

// describe("HtlcRefundData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				lockTransactionId: () => "lockTransactionId",
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#lockTransactionId", () => {
// 		assert.is(subject.lockTransactionId(), "lockTransactionId");
// 	});
// });

// describe("IpfsData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				hash: () => "hash",
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#hash", () => {
// 		assert.is(subject.hash(), "hash");
// 	});
// });

// describe("MultiPaymentData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				payments: () => [{ recipientId: "recipientId", amount: BigNumber.make(1000, 8).times(1e8) }],
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#payments", () => {
// 		assert.equal(subject.payments(), [{ recipientId: "recipientId", amount: 1000 }]);
// 	});
// });

// describe("MultiSignatureData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				publicKeys: () => ["1", "2", "3"],
// 				min: () => 5,
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#publicKeys", () => {
// 		assert.equal(subject.publicKeys(), ["1", "2", "3"]);
// 	});

// 	test("#min", () => {
// 		assert.is(subject.min(), 5);
// 	});
// });

// describe("SecondSignatureData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				secondPublicKey: () => "secondPublicKey",
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#secondPublicKey", () => {
// 		assert.is(subject.secondPublicKey(), "secondPublicKey");
// 	});
// });

// describe("TransferData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(async () => {
// 		beforeEachCallback();

// 		subject = createSubject(
// 			wallet,
// 			{
// 				memo: () => "memo",
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	afterEach(() => {
// 		afterEachCallback();
// 	});

// 	test("#memo", () => {
// 		assert.is(subject.memo(), "memo");
// 	});
// });

// describe("VoteData", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				votes: () => ["vote"],
// 				unvotes: () => ["unvote"],
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("#votes", () => {
// 		assert.equal(subject.votes(), ["vote"]);
// 	});

// 	test("#unvotes", () => {
// 		assert.equal(subject.unvotes(), ["unvote"]);
// 	});
// });

// describe("Type Specific", ({ afterEach, beforeEach, test }) => {
// 	beforeEach(() => {
// 		subject = createSubject(
// 			wallet,
// 			{
// 				asset: () => ({ key: "value" }),
// 			},
// 			ExtendedConfirmedTransactionData,
// 		);
// 	});

// 	test("should return the asset", () => {
// 		assert.equal(subject.asset(), { key: "value" });
// 	});
// });

test.run();
