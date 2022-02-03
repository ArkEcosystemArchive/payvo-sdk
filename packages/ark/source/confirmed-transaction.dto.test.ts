import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";
import { describe } from "@payvo/sdk-test";

import CryptoConfiguration from "../test/fixtures/client/cryptoConfiguration.json";
import Fixture from "../test/fixtures/client/transaction.json";
import MultipaymentFixtures from "../test/fixtures/client/transactions.json";
import VoteFixtures from "../test/fixtures/client/votes.json";
import { createService } from "../test/mocking";
import { ConfirmedTransactionData } from "./confirmed-transaction.dto.js";

describe("ConfirmedTransactionData", async ({ assert, beforeEach, it, stub }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(Fixture.data);
	});

	it("should have an id", (context) => {
		assert.is(context.subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
	});

	it("should have a blockId", (context) => {
		assert.is(context.subject.blockId(), "13114381566690093367");
	});

	it("should have a timestamp", (context) => {
		assert.instance(context.subject.timestamp(), DateTime);
		assert.is(context.subject.timestamp()?.toUNIX(), Fixture.data.timestamp.unix);
		assert.is(context.subject.timestamp()?.toISOString(), Fixture.data.timestamp.human);
	});

	it("should have a number of confirmations", (context) => {
		assert.equal(context.subject.confirmations(), BigNumber.make(4_636_121));
	});

	it("should have a sender", (context) => {
		assert.is(context.subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
	});

	it("should have a recipient", (context) => {
		assert.is(context.subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	it("should have a list of recipients for multi payments", async (context) => {
		assert.equal(context.subject.recipients(), []);

		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(MultipaymentFixtures.data[0]);
		assert.length(context.subject.recipients(), 9);
	});

	it("should have an amount", async (context) => {
		assert.equal(context.subject.amount(), BigNumber.make("799999999"));

		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(MultipaymentFixtures.data[0]);
		assert.equal(context.subject.amount(), BigNumber.make("799999999"));
	});

	it("should have a fee", (context) => {
		assert.equal(context.subject.fee(), BigNumber.ZERO);
	});

	it("should determine if the transction is confirmed", (context) => {
		assert.true(context.subject.isConfirmed());
	});

	it("should be a return for transfers if sender equals recipient", (context) => {
		stub(context.subject, "isTransfer").returnValueOnce(true);
		stub(context.subject, "isSent").returnValueOnce(true);
		stub(context.subject, "isReceived").returnValueOnce(true);
		stub(context.subject, "recipient").returnValueOnce(context.subject.sender());

		assert.is(context.subject.isReturn(), true);
	});

	it("should not be a return for transfers if sender does not equal recipient", (context) => {
		stub(context.subject, "isTransfer").returnValueOnce(true);
		stub(context.subject, "isReceived").returnValueOnce(true);
		stub(context.subject, "recipient").returnValueOnce(context.subject.sender());

		assert.false(context.subject.isReturn());
	});

	it("should be a return true for multipayments if sender is included in recipients", (context) => {
		stub(context.subject, "isTransfer").returnValueOnce(false);
		stub(context.subject, "isMultiPayment").returnValueOnce(true);
		stub(context.subject, "recipients").returnValueOnce([
			{ address: context.subject.sender(), amount: BigNumber.ZERO },
		]);

		assert.is(context.subject.isReturn(), true);
	});

	it("should not be a return for multipayments if sender is not included in recipients", (context) => {
		stub(context.subject, "isTransfer").returnValueOnce(false);
		stub(context.subject, "isMultiPayment").returnValueOnce(true);
		stub(context.subject, "recipients").returnValueOnce([
			{ address: context.subject.recipient(), amount: BigNumber.ZERO },
		]);

		assert.false(context.subject.isReturn());
	});

	it("should not be a return if transaction type is not 'transfer' or 'multiPayment'", (context) => {
		stub(context.subject, "isTransfer").returnValueOnce(false);
		stub(context.subject, "isMultiPayment").returnValueOnce(false);

		assert.false(context.subject.isReturn());
	});

	it("should determine if the transction is sent", (context) => {
		assert.false(context.subject.isSent());
	});

	it("should determine if the transction is received", (context) => {
		assert.false(context.subject.isReceived());
	});

	it("should determine if the transction is a transfer", (context) => {
		assert.true(context.subject.isTransfer());
	});

	it("should determine if the transction is a second signature", (context) => {
		assert.false(context.subject.isSecondSignature());
	});

	it("should determine if the transction is a delegate registration", (context) => {
		assert.false(context.subject.isDelegateRegistration());
	});

	it("should determine if the transction is a vote combination type", async (context) => {
		assert.false(context.subject.isVoteCombination());

		const data = VoteFixtures.data[0];
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({ ...data, asset: { votes: [...data.asset.votes, "-X"] } });
		assert.is(context.subject.isVoteCombination(), true);
	});

	it("should determine if the transction is a vote", (context) => {
		assert.false(context.subject.isVote());
	});

	it("should determine if the transction is a unvote", (context) => {
		assert.false(context.subject.isUnvote());
	});

	it("should determine if the transction is a multi signature registration", (context) => {
		assert.false(context.subject.isMultiSignatureRegistration());
	});

	it("should determine if the transction is a ipfs", (context) => {
		assert.false(context.subject.isIpfs());
	});

	it("should determine if the transction is a multi payment", (context) => {
		assert.false(context.subject.isMultiPayment());
	});

	it("should determine if the transction is a delegate resignation", (context) => {
		assert.false(context.subject.isDelegateResignation());
	});

	it("should determine if the transction is a htlc lock", (context) => {
		assert.false(context.subject.isHtlcLock());
	});

	it("should determine if the transction is a htlc claim", (context) => {
		assert.false(context.subject.isHtlcClaim());
	});

	it("should determine if the transction is a htlc refund", (context) => {
		assert.false(context.subject.isHtlcRefund());
	});

	it("should determine if the transction is a magistrate", (context) => {
		assert.false(context.subject.isMagistrate());
	});

	it("should turn into an object", (context) => {
		assert.object(context.subject.toObject());
	});

	it("should return the underlying data", (context) => {
		assert.equal(context.subject.raw(), Fixture.data);
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "transfer");
	});
});

describe("ConfirmedTransactionData - DelegateRegistrationData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
	});

	it("should a username for the delegate", (context) => {
		assert.is(context.subject.username(), "genesis_1");
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "delegateRegistration");
	});
});

describe("ConfirmedTransactionData - DelegateResignationData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		CryptoConfiguration.data.genesisBlock.transactions[1].type = 7;
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure(CryptoConfiguration.data.genesisBlock.transactions[1]);
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "delegateResignation");
	});
});

describe("ConfirmedTransactionData - HtlcClaimData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({ asset: { lock: { lockTransactionId: "1", unlockSecret: "2" } }, type: 9 });
	});

	it("should have the ID of a locked transaction", (context) => {
		assert.is(context.subject.lockTransactionId(), "1");
	});

	it("should have an unlock secret", (context) => {
		assert.is(context.subject.unlockSecret(), "2");
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "htlcClaim");
	});
});

describe("ConfirmedTransactionData - HtlcLockData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({
			asset: {
				lock: {
					amount: 1,
					expiration: {
						type: 1,
						value: 123_456_789,
					},
					secretHash: "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454",
					to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9",
				},
			},
			type: 8,
		});
	});

	it("should have a secret hash for claim", (context) => {
		assert.is(context.subject.secretHash(), "0f128d401958b1b30ad0d10406f47f9489321017b4614e6cb993fc63913c5454");
	});

	it("should have an expiration type", (context) => {
		assert.is(context.subject.expirationType(), 1);
	});

	it("should have an expiration value", (context) => {
		assert.is(context.subject.expirationValue(), 123_456_789);
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "htlcLock");
	});
});

describe("ConfirmedTransactionData - HtlcRefundData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({ asset: { refund: { lockTransactionId: "1", unlockSecret: "2" } }, type: 10 });
	});

	it("should have the ID of a locked transaction", (context) => {
		assert.is(context.subject.lockTransactionId(), "1");
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "htlcRefund");
	});
});

describe("ConfirmedTransactionData - IpfsData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({ asset: { ipfs: "123456789" }, type: 5 });
	});

	it("should have an IPFS hash", (context) => {
		assert.is(context.subject.hash(), "123456789");
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "ipfs");
	});
});

describe("ConfirmedTransactionData - MultiPaymentData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({
			asset: {
				payments: [
					{ amount: 10, to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9" },
					{ amount: 10, to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9" },
					{ amount: 10, to: "DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9" },
				],
			},
			type: 6,
		});
	});

	it("should have a memo", (context) => {
		assert.undefined(context.subject.memo());
	});

	it("should have a list of payments", (context) => {
		assert.length(context.subject.payments(), 3);
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "multiPayment");
	});
});

describe("ConfirmedTransactionData - MultiSignatureData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({
			asset: {
				multiSignature: {
					min: 1,
					publicKeys: ["2", "3"],
				},
			},
			type: 4,
		});
	});

	it("should have a list of participant public keys", (context) => {
		assert.length(context.subject.publicKeys(), 2);
	});

	it("should have a minimum number or required signatures", (context) => {
		assert.is(context.subject.min(), 1);
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "multiSignature");
	});
});

describe("ConfirmedTransactionData - SecondSignatureData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({ asset: { signature: { publicKey: "1" } }, type: 1 });
	});

	it("should have a secondary public key", (context) => {
		assert.is(context.subject.secondPublicKey(), "1");
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "secondSignature");
	});
});

describe("ConfirmedTransactionData - TransferData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({ vendorField: "X" });
	});

	it("should have a memo", (context) => {
		assert.is(context.subject.memo(), "X");
	});

	it("should have a type", (context) => {
		assert.is(context.subject.type(), "transfer");
	});
});

describe("ConfirmedTransactionData - VoteData", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(ConfirmedTransactionData);
		context.subject.configure({ asset: { votes: ["+A", "-B"] }, type: 3 });
	});

	it("should have a list of votes", (context) => {
		assert.length(context.subject.votes(), 1);
		assert.is(context.subject.votes()[0], "A");
	});

	it("should have a list of unvotes", (context) => {
		assert.length(context.subject.unvotes(), 1);
		assert.is(context.subject.unvotes()[0], "B");
	});

	it("should have 3 different types of votes", (context) => {
		context.subject.configure({ asset: { votes: ["+A", "-B"] }, type: 3 });

		assert.is(context.subject.type(), "voteCombination");

		context.subject.configure({ asset: { votes: ["+A"] }, type: 3 });

		assert.is(context.subject.type(), "vote");

		context.subject.configure({ asset: { votes: ["-B"] }, type: 3 });

		assert.is(context.subject.type(), "unvote");
	});
});
