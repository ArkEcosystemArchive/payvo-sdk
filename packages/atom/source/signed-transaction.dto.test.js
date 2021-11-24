import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto";

let subject;

describe("SignedTransactionData", async ({ beforeEach, assert, it }) => {
	beforeEach(async () => {
		subject = await createService(SignedTransactionData);

		subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				timestamp: "1970-01-01T00:00:00.000Z",
			},
			"",
		);
	});

	it("should have timestamp", () => {
		assert.true(DateTime.make(0).isSame(subject.timestamp()));
	});
});
