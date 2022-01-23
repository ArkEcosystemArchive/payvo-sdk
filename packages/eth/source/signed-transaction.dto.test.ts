import { describe } from "@payvo/sdk-test";

import { createService } from "../test/mocking";
import { SignedTransactionData } from "./signed-transaction.dto.js";

let subject;

describe("SignedTransactionData", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async () => {
		subject = await createService(SignedTransactionData);

		subject.configure(
			"hash",
			{
				sender: "sender",
				recipient: "recipient",
				amount: 100_000,
				fee: 12_430,
				timestamp: "1970-01-01T00:00:00.000Z",
				memo: "0x123",
			},
			"",
		);
	});

	it("#sender", () => {
		assert.is(subject.sender(), "sender");
	});

	it("#recipient", () => {
		assert.is(subject.recipient(), "recipient");
	});

	it("#amount", () => {
		assert.is(subject.amount().toNumber(), 100_000);
	});

	it("#fee", () => {
		assert.is(subject.fee().toNumber(), 12_430);
	});

	it("#timestamp", () => {
		assert.is(subject.timestamp().toISOString(), "1970-01-01T00:00:00.000Z");
	});

	it("#memo", () => {
		assert.is(subject.memo(), "0x123");
	});
});
