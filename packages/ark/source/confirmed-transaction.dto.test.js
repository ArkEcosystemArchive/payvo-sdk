import { describe } from "@payvo/sdk-test";

import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import CryptoConfiguration from "../test/fixtures/client/cryptoConfiguration.json";
import Fixture from "../test/fixtures/client/transaction.json";
import MultipaymentFixtures from "../test/fixtures/client/transactions.json";
import VoteFixtures from "../test/fixtures/client/votes.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto";

let subject;

describe("ConfirmedTransactionData", async ({ assert, beforeEach, it, stub }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure(Fixture.data);
	});

	it("should have an id", () => {
		assert.is(subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
	});

	it("should have a blockId", () => {
		assert.is(subject.blockId(), "13114381566690093367");
	});

	it("should have a timestamp", () => {
		assert.instance(subject.timestamp(), DateTime);
		assert.is(subject.timestamp()?.toUNIX(), Fixture.data.timestamp.unix);
		assert.is(subject.timestamp()?.toISOString(), Fixture.data.timestamp.human);
	});

	it("should have a number of confirmations", () => {
		assert.equal(subject.confirmations(), BigNumber.make(4636121));
	});

	it("should have a sender", () => {
		assert.is(subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
	});

	it("should have a recipient", () => {
		assert.is(subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	it("should have a list of recipients for multi payments", async () => {
		assert.equal(subject.recipients(), []);

		subject = await createService(ConfirmedTransactionData);
		subject.configure(MultipaymentFixtures.data[0]);
		assert.length(subject.recipients(), 9);
	});

	it("should have an amount", async () => {
		assert.equal(subject.amount(), BigNumber.make("12500000000000000"));

		subject = await createService(ConfirmedTransactionData);
		subject.configure(MultipaymentFixtures.data[0]);
		assert.equal(subject.amount(), BigNumber.make("12500000000000000"));
	});

	it("should have a fee", () => {
		assert.equal(subject.fee(), BigNumber.ZERO);
	});

	it("should determine if the transction is confirmed", () => {
		assert.true(subject.isConfirmed());
	});

	it("should be a return for transfers if sender equals recipient", () => {
		stub(subject, "isTransfer").returnValueOnce(true);
		stub(subject, "isSent").returnValueOnce(true);
		stub(subject, "isReceived").returnValueOnce(true);
		stub(subject, "recipient").returnValueOnce(subject.sender());

		assert.is(subject.isReturn(), true);
	});

	it("should not be a return for transfers if sender does not equal recipient", () => {
		stub(subject, "isTransfer").returnValueOnce(true);
		stub(subject, "isReceived").returnValueOnce(true);
		stub(subject, "recipient").returnValueOnce(subject.sender());

		assert.false(subject.isReturn());
	});

	it("should be a return true for multipayments if sender is included in recipients", () => {
		stub(subject, "isTransfer").returnValueOnce(false);
		stub(subject, "isMultiPayment").returnValueOnce(true);
		stub(subject, "recipients").returnValueOnce([{ amount: BigNumber.ZERO, address: subject.sender() }]);

		assert.is(subject.isReturn(), true);
	});

	it("should not be a return for multipayments if sender is not included in recipients", () => {
		stub(subject, "isTransfer").returnValueOnce(false);
		stub(subject, "isMultiPayment").returnValueOnce(true);
		stub(subject, "recipients").returnValueOnce([{ amount: BigNumber.ZERO, address: subject.recipient() }]);

		assert.false(subject.isReturn());
	});

	it("should not be a return if transaction type is not 'transfer' or 'multiPayment'", () => {
		stub(subject, "isTransfer").returnValueOnce(false);
		stub(subject, "isMultiPayment").returnValueOnce(false);

		assert.false(subject.isReturn());
	});

	it("should determine if the transction is sent", () => {
		assert.false(subject.isSent());
	});

	it("should determine if the transction is received", () => {
		assert.false(subject.isReceived());
	});

	it("should determine if the transction is a transfer", () => {
		assert.true(subject.isTransfer());
	});

	it("should determine if the transction is a second signature", () => {
		assert.false(subject.isSecondSignature());
	});

	it("should determine if the transction is a delegate registration", () => {
		assert.false(subject.isDelegateRegistration());
	});

	it("should determine if the transction is a vote combination type", async () => {
		assert.false(subject.isVoteCombination());

		const data = VoteFixtures.data[0];
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ ...data, asset: { votes: [...data.asset.votes, "-X"] } });
		assert.is(subject.isVoteCombination(), true);
	});

	it("should determine if the transction is a vote", () => {
		assert.false(subject.isVote());
	});

	it("should determine if the transction is a unvote", () => {
		assert.false(subject.isUnvote());
	});

	it("should determine if the transction is a multi signature registration", () => {
		assert.false(subject.isMultiSignatureRegistration());
	});

	it("should determine if the transction is a ipfs", () => {
		assert.false(subject.isIpfs());
	});

	it("should determine if the transction is a multi payment", () => {
		assert.false(subject.isMultiPayment());
	});

	it("should determine if the transction is a delegate resignation", () => {
		assert.false(subject.isDelegateResignation());
	});

	it("should determine if the transction is a htlc lock", () => {
		assert.false(subject.isHtlcLock());
	});

	it("should determine if the transction is a htlc claim", () => {
		assert.false(subject.isHtlcClaim());
	});

	it("should determine if the transction is a htlc refund", () => {
		assert.false(subject.isHtlcRefund());
	});

	it("should determine if the transction is a magistrate", () => {
		assert.false(subject.isMagistrate());
	});

	it("should turn into an object", () => {
		assert.object(subject.toObject());
	});

	it("should return the underlying data", () => {
		assert.equal(subject.raw(), Fixture.data);
	});

	it("should have a type", () => {
		assert.is(subject.type(), "transfer");
	});
});

describe("ConfirmedTransactionData - DelegateRegistrationData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
	});

	it("should a username for the delegate", () => {
		assert.is(subject.username(), "genesis_1");
	});

	it("should have a type", () => {
		assert.is(subject.type(), "delegateRegistration");
	});
});

describe("ConfirmedTransactionData - DelegateResignationData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		CryptoConfiguration.data.genesisBlock.transactions[1].type = 7;
		subject = await createService(ConfirmedTransactionData);
		subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
	});

	it("should have a type", () => {
		assert.is(subject.type(), "delegateResignation");
	});
});

describe("ConfirmedTransactionData - HtlcClaimData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 9, asset: { lock: { lockTransactionId: "1", unlockSecret: "2" } } });
	});

	it("should have the ID of a locked transaction", () => {
		assert.is(subject.lockTransactionId(), "1");
	});

	it("should have an unlock secret", () => {
		assert.is(subject.unlockSecret(), "2");
	});

	it("should have a type", () => {
		assert.is(subject.type(), "htlcClaim");
	});
});

describe("ConfirmedTransactionData - HtlcLockData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
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

	it("should have a secret hash for claim", () => {
		assert.is(subject.secretHash(), "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454");
	});

	it("should have an expiration type", () => {
		assert.is(subject.expirationType(), 1);
	});

	it("should have an expiration value", () => {
		assert.is(subject.expirationValue(), 123456789);
	});

	it("should have a type", () => {
		assert.is(subject.type(), "htlcLock");
	});
});

describe("ConfirmedTransactionData - HtlcRefundData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 10, asset: { refund: { lockTransactionId: "1", unlockSecret: "2" } } });
	});

	it("should have the ID of a locked transaction", () => {
		assert.is(subject.lockTransactionId(), "1");
	});

	it("should have a type", () => {
		assert.is(subject.type(), "htlcRefund");
	});
});

describe("ConfirmedTransactionData - IpfsData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 5, asset: { ipfs: "123456789" } });
	});

	it("should have an IPFS hash", () => {
		assert.is(subject.hash(), "123456789");
	});

	it("should have a type", () => {
		assert.is(subject.type(), "ipfs");
	});
});

describe("ConfirmedTransactionData - MultiPaymentData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
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

	it("should have a memo", () => {
		assert.undefined(subject.memo());
	});

	it("should have a list of payments", () => {
		assert.length(subject.payments(), 3);
	});

	it("should have a type", () => {
		assert.is(subject.type(), "multiPayment");
	});
});

describe("ConfirmedTransactionData - MultiSignatureData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
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

	it("should have a list of participant public keys", () => {
		assert.length(subject.publicKeys(), 2);
	});

	it("should have a minimum number or required signatures", () => {
		assert.is(subject.min(), 1);
	});

	it("should have a type", () => {
		assert.is(subject.type(), "multiSignature");
	});
});

describe("ConfirmedTransactionData - SecondSignatureData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 1, asset: { signature: { publicKey: "1" } } });
	});

	it("should have a secondary public key", () => {
		assert.is(subject.secondPublicKey(), "1");
	});

	it("should have a type", () => {
		assert.is(subject.type(), "secondSignature");
	});
});

describe("ConfirmedTransactionData - TransferData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ vendorField: "X" });
	});

	it("should have a memo", () => {
		assert.is(subject.memo(), "X");
	});

	it("should have a type", () => {
		assert.is(subject.type(), "transfer");
	});
});

describe("ConfirmedTransactionData - VoteData", ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(ConfirmedTransactionData);
		subject.configure({ type: 3, asset: { votes: ["+A", "-B"] } });
	});

	it("should have a list of votes", () => {
		assert.length(subject.votes(), 1);
		assert.is(subject.votes()[0], "A");
	});

	it("should have a list of unvotes", () => {
		assert.length(subject.unvotes(), 1);
		assert.is(subject.unvotes()[0], "B");
	});

	it("should have 3 different types of votes", () => {
		subject.configure({ type: 3, asset: { votes: ["+A", "-B"] } });

		assert.is(subject.type(), "voteCombination");

		subject.configure({ type: 3, asset: { votes: ["+A"] } });

		assert.is(subject.type(), "vote");

		subject.configure({ type: 3, asset: { votes: ["-B"] } });

		assert.is(subject.type(), "unvote");
	});
});
