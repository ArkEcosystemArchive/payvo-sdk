import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";
import { BigNumber } from "@payvo/sdk-helpers";

let subject;

describe("SignedTransactionData", async ({ beforeEach, it, assert }) => {
	beforeEach(async () => {
		subject = await createService(SignedTransactionData);

		subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				fromAddress: "123456",
				toAddress: "456789",
				amountRaw: "120000000000000000000000000000000",
				timestamp: "1970-01-01T00:00:00.000Z",
			},
			"",
		);
	});

	it("should have a sender", () => {
		assert.is(subject.sender(), "123456");
	});

	it("should have a recipient", () => {
		assert.is(subject.recipient(), "456789");
	});

	it("should have an amount", () => {
		assert.is(subject.amount().toHuman(), 120);
	});

	it("should have a fee", () => {
		assert.equal(subject.fee(), BigNumber.ZERO);
	});

	it("should have a timestamp", () => {
		assert.true(DateTime.make(0).isSame(subject.timestamp()));
	});
});
