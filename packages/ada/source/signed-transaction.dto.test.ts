import { describe } from "@payvo/sdk-test";
import { DateTime } from "@payvo/sdk-intl";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";

describe("SignedTransactionData", async ({ assert, beforeEach, it }) => {
	beforeEach(async (context) => {
		context.subject = await createService(SignedTransactionData);

		context.subject.configure(
			"3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
			{
				id: "3e3817fd0c35bc36674f3874c2953fa3e35877cbcdb44a08bdc6083dbd39d572",
				amount: "12500000000000000",
				fee: "0",
				timestamp: "1970-01-01T00:00:00.000Z",
				sender: "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4",
				recipient: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
			},
			"",
		);
	});

	it("#sender should succeed", (context) => {
		assert.is(context.subject.sender(), "0208e6835a8f020cfad439c059b89addc1ce21f8cab0af6e6957e22d3720bff8a4");
	});

	it("#recipient should succeed", (context) => {
		assert.is(context.subject.recipient(), "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax");
	});

	it("#amount should succeed", (context) => {
		assert.is(context.subject.amount().toHuman(), 12500000000);
	});

	it("#fee should succeed", (context) => {
		assert.is(context.subject.fee().toNumber(), 0);
	});

	it("#timestamp should succeed", (context) => {
		assert.true(DateTime.make(0).isSame(context.subject.timestamp()));
	});
});
