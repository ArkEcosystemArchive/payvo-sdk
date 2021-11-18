import { assert, describe, mockery, test } from "@payvo/sdk-test";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import CryptoConfiguration from "../test/fixtures/client/cryptoConfiguration.json";
import Fixture from "../test/fixtures/client/transaction.json";
import MultipaymentFixtures from "../test/fixtures/client/transactions.json";
import VoteFixtures from "../test/fixtures/client/votes.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

test.before.each(async () => {
	subject = await createService(ConfirmedTransactionData);
	subject.configure(Fixture.data);
});

test("#id", () => {
	assert.is(subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
});

test("#blockId", () => {
	assert.is(subject.blockId(), "13114381566690093367");
});

test("#timestamp", () => {
	assert.instance(subject.timestamp(), DateTime);
	assert.is(subject.timestamp()?.toUNIX(), Fixture.data.timestamp.unix);
	assert.is(subject.timestamp()?.toISOString(), Fixture.data.timestamp.human);
});

test("#confirmations", () => {
	assert.equal(subject.confirmations(), BigNumber.make(4636121));
});

test("#sender", () => {
	assert.is(subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
});

test("#recipient", () => {
	assert.is(subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
});

test("#recipients", async () => {
	assert.equal(subject.recipients(), []);

	subject = await createService(ConfirmedTransactionData);
	subject.configure(MultipaymentFixtures.data[0]);
	assert.length(subject.recipients(), 9);
});

test("#amount", async () => {
	assert.equal(subject.amount(), BigNumber.make("12500000000000000"));

	subject = await createService(ConfirmedTransactionData);
	subject.configure(MultipaymentFixtures.data[0]);
	assert.equal(subject.amount(), BigNumber.make("12500000000000000"));
});

test("#fee", () => {
	assert.equal(subject.fee(), BigNumber.ZERO);
});

test("#asset", () => {
	assert.equal(subject.asset(), {});
});

test("#inputs", () => {
	assert.equal(subject.inputs(), []);
});

test("#outputs", () => {
	assert.equal(subject.outputs(), []);
});

test("#isConfirmed", () => {
	assert.true(subject.isConfirmed());
});

describe("#isReturn", (suite) => {
	test("should return true for transfers if sender equals recipient", () => {
		mockery(subject, "isTransfer").mockReturnValueOnce(true);
		mockery(subject, "isSent").mockReturnValueOnce(true);
		mockery(subject, "isReceived").mockReturnValueOnce(true);
		mockery(subject, "recipient").mockReturnValueOnce(subject.sender());

		assert.is(subject.isReturn(), true);
	});

	test("should return false for transfers if sender does not equal recipient", () => {
		mockery(subject, "isTransfer").mockReturnValueOnce(true);
		mockery(subject, "isReceived").mockReturnValueOnce(true);
		mockery(subject, "recipient").mockReturnValueOnce(subject.sender());

		assert.false(subject.isReturn());
	});

	test("should return true for multipayments if sender is included in recipients", () => {
		mockery(subject, "isTransfer").mockReturnValueOnce(false);
		mockery(subject, "isMultiPayment").mockReturnValueOnce(true);
		mockery(subject, "recipients").mockReturnValueOnce([{ amount: BigNumber.ZERO, address: subject.sender() }]);

		assert.is(subject.isReturn(), true);
	});

	test("should return false for multipayments if sender is not included in recipients", () => {
		mockery(subject, "isTransfer").mockReturnValueOnce(false);
		mockery(subject, "isMultiPayment").mockReturnValueOnce(true);
		mockery(subject, "recipients").mockReturnValueOnce([{ amount: BigNumber.ZERO, address: subject.recipient() }]);

		assert.false(subject.isReturn());
	});

	test("should return false if transaction type is not 'transfer' or 'multiPayment'", () => {
		mockery(subject, "isTransfer").mockReturnValueOnce(false);
		mockery(subject, "isMultiPayment").mockReturnValueOnce(false);

		assert.false(subject.isReturn());
	});
});

test("#isSent", () => {
	assert.false(subject.isSent());
});

test("#isReceived", () => {
	assert.false(subject.isReceived());
});

test("#isTransfer", () => {
	assert.true(subject.isTransfer());
});

test("#isSecondSignature", () => {
	assert.false(subject.isSecondSignature());
});

test("#isDelegateRegistration", () => {
	assert.false(subject.isDelegateRegistration());
});

test("#isVoteCombination", async () => {
	assert.false(subject.isVoteCombination());

	const data = VoteFixtures.data[0];
	subject = await createService(ConfirmedTransactionData);
	subject.configure({ ...data, asset: { votes: [...data.asset.votes, "-X"] } });
	assert.is(subject.isVoteCombination(), true);
});

test("#isVote", () => {
	assert.false(subject.isVote());
});

test("#isUnvote", () => {
	assert.false(subject.isUnvote());
});

test("#isMultiSignatureRegistration", () => {
	assert.false(subject.isMultiSignatureRegistration());
});

test("#isIpfs", () => {
	assert.false(subject.isIpfs());
});

test("#isMultiPayment", () => {
	assert.false(subject.isMultiPayment());
});

test("#isDelegateResignation", () => {
	assert.false(subject.isDelegateResignation());
});

test("#isHtlcLock", () => {
	assert.false(subject.isHtlcLock());
});

test("#isHtlcClaim", () => {
	assert.false(subject.isHtlcClaim());
});

test("#isHtlcRefund", () => {
	assert.false(subject.isHtlcRefund());
});

test("#isMagistrate", () => {
	assert.false(subject.isMagistrate());
});

test("#toObject", () => {
	assert.object(subject.toObject());
});

test("#raw", () => {
	assert.equal(subject.raw(), Fixture.data);
});

test("#type", () => {
	assert.is(subject.type(), "transfer");
});

describe("DelegateRegistrationData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
	});

	suite("#id", () => {
		assert.is(subject.username(), "genesis_1");
	});

	suite("#type", () => {
		assert.is(subject.type(), "delegateRegistration");
	});
});

describe("DelegateResignationData", (suite) => {
	suite.before.each(async () => {
		CryptoConfiguration.data.genesisBlock.transactions[1].type = 7;
		subject = await createService(ConfirmedTransactionData);
		subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
	});

	suite("#type", () => {
		assert.is(subject.type(), "delegateResignation");
	});
});

describe("HtlcClaimData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 9, asset: { lock: { lockTransactionId: "1", unlockSecret: "2" } } });
	});

	suite("#lockTransactionId", () => {
		assert.is(subject.lockTransactionId(), "1");
	});

	suite("#unlockSecret", () => {
		assert.is(subject.unlockSecret(), "2");
	});

	suite("#type", () => {
		assert.is(subject.type(), "htlcClaim");
	});
});

describe("HtlcLockData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({
			type: 8,
			asset: {
				lock: {
					amount: 1,
					to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
					secretHash: "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454",
					expiration: {
						type: 1,
						value: 123456789,
					},
				},
			},
		});
	});

	suite("#secretHash", () => {
		assert.is(subject.secretHash(), "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454");
	});

	suite("#expirationType", () => {
		assert.is(subject.expirationType(), 1);
	});

	suite("#expirationValue", () => {
		assert.is(subject.expirationValue(), 123456789);
	});

	suite("#type", () => {
		assert.is(subject.type(), "htlcLock");
	});
});

describe("HtlcRefundData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 10, asset: { refund: { lockTransactionId: "1", unlockSecret: "2" } } });
	});

	suite("#lockTransactionId", () => {
		assert.is(subject.lockTransactionId(), "1");
	});

	suite("#type", () => {
		assert.is(subject.type(), "htlcRefund");
	});
});

describe("IpfsData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 5, asset: { ipfs: "123456789" } });
	});

	suite("#lockTransactionId", () => {
		assert.is(subject.hash(), "123456789");
	});

	suite("#type", () => {
		assert.is(subject.type(), "ipfs");
	});
});

describe("MultiPaymentData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({
			type: 6,
			asset: {
				payments: [
					{ to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
					{ to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
					{ to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9", amount: 10 },
				],
			},
		});
	});

	suite("#memo", () => {
		assert.undefined(subject.memo());
	});

	suite("#payments", () => {
		assert.length(subject.payments(), 3);
	});

	suite("#type", () => {
		assert.is(subject.type(), "multiPayment");
	});
});

describe("MultiSignatureData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({
			type: 4,
			asset: {
				multiSignature: {
					min: 1,
					publicKeys: ["2", "3"],
				},
			},
		});
	});

	suite("#publicKeys", () => {
		assert.length(subject.publicKeys(), 2);
	});

	suite("#min", () => {
		assert.is(subject.min(), 1);
	});

	suite("#type", () => {
		assert.is(subject.type(), "multiSignature");
	});
});

describe("SecondSignatureData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 1, asset: { signature: { publicKey: "1" } } });
	});

	suite("#publicKeys", () => {
		assert.is(subject.secondPublicKey(), "1");
	});

	suite("#type", () => {
		assert.is(subject.type(), "secondSignature");
	});
});

describe("TransferData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ vendorField: "X" });
	});

	suite("#memo", () => {
		assert.is(subject.memo(), "X");
	});

	suite("#type", () => {
		assert.is(subject.type(), "transfer");
	});
});

describe("VoteData", (suite) => {
	suite.before.each(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 3, asset: { votes: ["+A", "-B"] } });
	});

	suite("#votes", () => {
		assert.length(subject.votes(), 1);
		assert.is(subject.votes()[0], "A");
	});

	suite("#unvotes", () => {
		assert.length(subject.unvotes(), 1);
		assert.is(subject.unvotes()[0], "B");
	});

	suite("#type", () => {
		subject.configure({ type: 3, asset: { votes: ["+A", "-B"] } });

		assert.is(subject.type(), "voteCombination");

		subject.configure({ type: 3, asset: { votes: ["+A"] } });

		assert.is(subject.type(), "vote");

		subject.configure({ type: 3, asset: { votes: ["-B"] } });

		assert.is(subject.type(), "unvote");
	});
});

test.run();
