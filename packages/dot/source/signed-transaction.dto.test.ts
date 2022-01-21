import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";

describe("SignedTransactionData", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(SignedTransactionData);

		context.subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				signature: {
					signer: "0xdeadbeef",
				},
				method: {
					args: {
						dest: "0xfoobar",
						value: "1200000000000",
					},
				},
				timestamp: "1970-01-01T00:00:00.000Z",
			},
			"",
		);
	});

	it("should have a sender", (context) => {
		assert.is(context.subject.sender(), "0xdeadbeef");
	});

	it("should have a recipient", (context) => {
		assert.is(context.subject.recipient(), "0xfoobar");
	});

	it("should have an amount", (context) => {
		assert.is(context.subject.amount().toHuman(), 120);
	});

	it("should have a fee", (context) => {
		assert.is(context.subject.fee().toNumber(), 0);
	});

	it("should have a timestamp", (context) => {
		assert.true(DateTime.make(0).isSame(context.subject.timestamp()));
	});
});
