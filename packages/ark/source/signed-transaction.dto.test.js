import { assert, test } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";
import { BigNumber } from "@payvo/sdk-helpers";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject;

test.before(async () => {
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

test("#id", () => {
	assert.is(subject.id(), "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
});

test("#sender", () => {
	assert.is(subject.sender(), "DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
});

test("#recipient", () => {
	assert.is(subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
});

test("#amount", () => {
	assert.equal(subject.amount(), BigNumber.make("12500000000000000"));
});

test("#amount for MultiPayment", () => {
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

test("#fee", () => {
	assert.equal(subject.fee(), BigNumber.ZERO);
});

test("#timestamp", () => {
	assert.true(DateTime.make(0).isSame(subject.timestamp()));
});

test("#timestamp missing", async () => {
	const subject = await createService(SignedTransactionData);
	subject.configure("", {}, "");
	assert.instance(subject.timestamp(), DateTime);
});

test("#isTransfer", () => {
	assert.boolean(subject.isTransfer());
});

test("#isSecondSignature", () => {
	assert.boolean(subject.isSecondSignature());
});

test("#isDelegateRegistration", () => {
	assert.boolean(subject.isDelegateRegistration());
});

test("#isVoteCombination", () => {
	assert.boolean(subject.isVoteCombination());
});

test("#isVote", () => {
	assert.boolean(subject.isVote());
});

test("#isUnvote", () => {
	assert.boolean(subject.isUnvote());
});

test("#isMultiSignatureRegistration", () => {
	assert.boolean(subject.isMultiSignatureRegistration());
});

test("#isIpfs", () => {
	assert.boolean(subject.isIpfs());
});

test("#isMultiPayment", () => {
	assert.boolean(subject.isMultiPayment());
});

test("#isDelegateResignation", () => {
	assert.boolean(subject.isDelegateResignation());
});

test("#isHtlcLock", () => {
	assert.boolean(subject.isHtlcLock());
});

test("#isHtlcClaim", () => {
	assert.boolean(subject.isHtlcClaim());
});

test("#isHtlcRefund", () => {
	assert.boolean(subject.isHtlcRefund());
});

test("#isMagistrate", () => {
	assert.boolean(subject.isMagistrate());
});

test("#usesMultiSignature", () => {
	assert.boolean(subject.usesMultiSignature());
});

test.run();
