import "jest-extended";

import { DateTime } from "@payvo/intl";
import { BigNumber } from "@payvo/helpers";

import { createService, require } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject: SignedTransactionData;

beforeAll(async () => {
	subject = await createService(SignedTransactionData);

	subject.configure(
		"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
		{
			id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			amount: "12500000000000000",
			fee: "0",
			timestamp: 1597806483,
			senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
			recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		},
		"",
	);
});

describe("SignedTransactionData", () => {
	test("#id", () => {
		expect(subject.id()).toBe("3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572");
	});

	test("#sender", () => {
		expect(subject.sender()).toBe("DLK7ts2DpkbeBjFamuFtHLoDAq5upDhCmf");
	});

	test("#recipient", () => {
		expect(subject.recipient()).toBe("D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	test("#amount", () => {
		expect(subject.amount()).toEqual(BigNumber.make("12500000000000000"));
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
				timestamp: 1597806483,
				senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
				recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
			},
			"",
		);

		expect(subject.amount()).toEqual(BigNumber.make("25000000000000000"));
	});

	test("#fee", () => {
		expect(subject.fee()).toEqual(BigNumber.ZERO);
	});

	test("#timestamp", () => {
		const transaction = {
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
			timestamp: 1597806483,
			senderPublicKey: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
			recipientId: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
		};

		subject.configure(transaction.id, transaction, "");

		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.timestamp().toString()).toMatchInlineSnapshot(`"Wed, 19 Aug 2020 03:08:03 GMT"`);

		subject.configure(
			transaction.id,
			{ timestamp: "2020-08-19T03:08:03.000Z" },
			{ ...transaction, timestamp: "2020-08-19T03:08:03.000Z" },
		);

		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.timestamp().toString()).toMatchInlineSnapshot(`"Wed, 19 Aug 2020 03:08:03 GMT"`);

		subject.configure(
			transaction.id,
			{ ...transaction, timestamp: DateTime.fromUnix(transaction.timestamp) },
			{ ...transaction, timestamp: DateTime.fromUnix(transaction.timestamp) },
		);

		expect(subject.timestamp()).toBeInstanceOf(DateTime);
		expect(subject.timestamp().toString()).toMatchInlineSnapshot(`"Wed, 19 Aug 2020 03:08:03 GMT"`);
	});

	test("#isTransfer", () => {
		expect(subject.isTransfer()).toBeBoolean();
	});

	test("#isSecondSignature", () => {
		expect(subject.isSecondSignature()).toBeBoolean();
	});

	test("#isDelegateRegistration", () => {
		expect(subject.isDelegateRegistration()).toBeBoolean();
	});

	test("#isVoteCombination", () => {
		expect(subject.isVoteCombination()).toBeBoolean();
	});

	test("#isVote", () => {
		expect(subject.isVote()).toBeBoolean();
	});

	test("#isUnvote", () => {
		expect(subject.isUnvote()).toBeBoolean();
	});

	test("#isMultiSignatureRegistration", () => {
		expect(subject.isMultiSignatureRegistration()).toBeBoolean();
	});

	test("#isIpfs", () => {
		expect(subject.isIpfs()).toBeBoolean();
	});

	test("#isMultiPayment", () => {
		expect(subject.isMultiPayment()).toBeBoolean();
	});

	test("#isDelegateResignation", () => {
		expect(subject.isDelegateResignation()).toBeBoolean();
	});

	test("#isHtlcLock", () => {
		expect(subject.isHtlcLock()).toBeBoolean();
	});

	test("#isHtlcClaim", () => {
		expect(subject.isHtlcClaim()).toBeBoolean();
	});

	test("#isHtlcRefund", () => {
		expect(subject.isHtlcRefund()).toBeBoolean();
	});

	test("#isMagistrate", () => {
		expect(subject.isMagistrate()).toBeBoolean();
	});

	test("#usesMultiSignature", () => {
		expect(subject.usesMultiSignature()).toBeBoolean();
	});
});
