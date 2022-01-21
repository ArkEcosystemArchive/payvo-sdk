import { BigNumber } from "@payvo/sdk-helpers";
import { DateTime } from "@payvo/sdk-intl";
import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";

describe("SignedTransactionData", async ({ assert, beforeAll, it, nock, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(SignedTransactionData);

		context.subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				amount: "12500000000000000",
				fee: "0",
				id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
				recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
				senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
				timestamp: "1970-01-01T00:00:00.000Z",
			},
			"",
		);
	});

	it("should have a id", (context) => {
		assert.is(context.subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
	});

	it("should have a sender", (context) => {
		assert.is(context.subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
	});

	it("should have a recipient", (context) => {
		assert.is(context.subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	it("should have an amount", (context) => {
		assert.equal(context.subject.amount(), BigNumber.make("12500000000000000"));
	});

	it("should have an amount for MultiPayment", (context) => {
		context.subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				asset: {
					payments: [
						{
							amount: "12500000000000000",
							recipientId: "",
						},
						{
							amount: "12500000000000000",
							recipientId: "",
						},
					],
				},
				fee: "0",
				id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
				recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
				senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
				timestamp: "1970-01-01T00:00:00.000Z",
				type: 6,
			},
			"",
		);

		assert.equal(context.subject.amount(), BigNumber.make("25000000000000000"));
	});

	it("should have a fee", (context) => {
		assert.equal(context.subject.fee(), BigNumber.ZERO);
	});

	it("should have a timestamp", (context) => {
		assert.true(DateTime.make(0).isSame(context.subject.timestamp()));
	});

	it("should have a timestamp even if the timestamp is missing", async () => {
		const subject = await createService(SignedTransactionData);
		subject.configure("", {}, "");
		assert.instance(subject.timestamp(), DateTime);
	});

	it("should determine if the transaction is a transfer", (context) => {
		assert.boolean(context.subject.isTransfer());
	});

	it("should determine if the transaction is a second signature", (context) => {
		assert.boolean(context.subject.isSecondSignature());
	});

	it("should determine if the transaction is a delegate registration", (context) => {
		assert.boolean(context.subject.isDelegateRegistration());
	});

	it("should determine if the transaction is a vote combination", (context) => {
		assert.boolean(context.subject.isVoteCombination());
	});

	it("should determine if the transaction is a vote", (context) => {
		assert.boolean(context.subject.isVote());
	});

	it("should determine if the transaction is a unvote", (context) => {
		assert.boolean(context.subject.isUnvote());
	});

	it("should determine if the transaction is a multi signature registration", (context) => {
		assert.boolean(context.subject.isMultiSignatureRegistration());
	});

	it("should determine if the transaction is a ipfs", (context) => {
		assert.boolean(context.subject.isIpfs());
	});

	it("should determine if the transaction is a multi payment", (context) => {
		assert.boolean(context.subject.isMultiPayment());
	});

	it("should determine if the transaction is a delegate resignation", (context) => {
		assert.boolean(context.subject.isDelegateResignation());
	});

	it("should determine if the transaction is a htlc lock", (context) => {
		assert.boolean(context.subject.isHtlcLock());
	});

	it("should determine if the transaction is a htlc claim", (context) => {
		assert.boolean(context.subject.isHtlcClaim());
	});

	it("should determine if the transaction is a htlc refund", (context) => {
		assert.boolean(context.subject.isHtlcRefund());
	});

	it("should determine if the transaction is a magistrate", (context) => {
		assert.boolean(context.subject.isMagistrate());
	});

	it("should determine if the transaction uses multi signature", (context) => {
		assert.boolean(context.subject.usesMultiSignature());
	});
});
