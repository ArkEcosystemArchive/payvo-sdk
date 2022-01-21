import { describe } from "@payvo/sdk-test";

import { ConfirmedTransactionDataCollection } from "./transactions.collection.js";

describe("ConfirmedTransactionDataCollection", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(
		(context) =>
			(context.subject = new ConfirmedTransactionDataCollection(
				[
					{
						id: (context) => "id",

						recipient: () => "recipient",

						sender: () => "sender",
						timestamp: () => "timestamp",
						type: () => "type",
					},
				],
				{ next: "", prev: "", self: "" },
			)),
	);

	it("should find transactions by id", (context) => {
		assert.object(context.subject.findById("id"));
	});

	it("should find transactions by type", (context) => {
		assert.object(context.subject.findByType("type"));
	});

	it("should find transactions by timestamp", (context) => {
		assert.object(context.subject.findByTimestamp("timestamp"));
	});

	it("should find transactions by sender", (context) => {
		assert.object(context.subject.findBySender("sender"));
	});

	it("should find transactions by recipient", (context) => {
		assert.object(context.subject.findByRecipient("recipient"));
	});
});
