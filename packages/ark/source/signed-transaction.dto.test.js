import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject;

describe("SignedTransactionData", async ({ assert, beforeAll, it }) => {
	beforeAll(async () => {
		subject = await createService(SignedTransactionData);

		subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
				amount: "12500000000000000",
				fee: "0",
				timestamp: "1970-01-01T00:00:00.000Z",
				senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
				recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
			},
			"",
		);
	});

	it("should have a id", () => {
		assert.is(subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
	});

	it("should have a sender", () => {
		assert.is(subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
	});

	it("should have a recipient", () => {
		assert.is(subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	it("should have an amount", () => {
		assert.equal(subject.amount(), BigNumber.make("12500000000000000"));
	});

	it("should have an amount for MultiPayment", () => {
		subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
				type: 6,
				fee: "0",
				asset: {
					payments: [
						{
							recipientId: "",
							amount: "12500000000000000",
						},
						{
							recipientId: "",
							amount: "12500000000000000",
						},
					],
				},
				timestamp: "1970-01-01T00:00:00.000Z",
				senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
				recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
			},
			"",
		);

		assert.equal(subject.amount(), BigNumber.make("25000000000000000"));
	});

	it("should have a fee", () => {
		assert.equal(subject.fee(), BigNumber.ZERO);
	});

	it("should have a timestamp", () => {
		assert.true(DateTime.make(0).isSame(subject.timestamp()));
	});

	it("should have a timestamp even if the timestamp is missing", async () => {
		const subject = await createService(SignedTransactionData);
		subject.configure("", {}, "");
		assert.instance(subject.timestamp(), DateTime);
	});

	it("should determine if the transaction is a transfer", () => {
		assert.boolean(subject.isTransfer());
	});

	it("should determine if the transaction is a second signature", () => {
		assert.boolean(subject.isSecondSignature());
	});

	it("should determine if the transaction is a delegate registration", () => {
		assert.boolean(subject.isDelegateRegistration());
	});

	it("should determine if the transaction is a vote combination", () => {
		assert.boolean(subject.isVoteCombination());
	});

	it("should determine if the transaction is a vote", () => {
		assert.boolean(subject.isVote());
	});

	it("should determine if the transaction is a unvote", () => {
		assert.boolean(subject.isUnvote());
	});

	it("should determine if the transaction is a multi signature registration", () => {
		assert.boolean(subject.isMultiSignatureRegistration());
	});

	it("should determine if the transaction is a ipfs", () => {
		assert.boolean(subject.isIpfs());
	});

	it("should determine if the transaction is a multi payment", () => {
		assert.boolean(subject.isMultiPayment());
	});

	it("should determine if the transaction is a delegate resignation", () => {
		assert.boolean(subject.isDelegateResignation());
	});

	it("should determine if the transaction is a htlc lock", () => {
		assert.boolean(subject.isHtlcLock());
	});

	it("should determine if the transaction is a htlc claim", () => {
		assert.boolean(subject.isHtlcClaim());
	});

	it("should determine if the transaction is a htlc refund", () => {
		assert.boolean(subject.isHtlcRefund());
	});

	it("should determine if the transaction is a magistrate", () => {
		assert.boolean(subject.isMagistrate());
	});

	it("should determine if the transaction uses multi signature", () => {
		assert.boolean(subject.usesMultiSignature());
	});
});
