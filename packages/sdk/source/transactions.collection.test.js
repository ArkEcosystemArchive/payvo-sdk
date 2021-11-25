import { describe } from "@payvo/sdk-test";
import { ConfirmedTransactionDataCollection } from "./transactions.collection";

let subject;

describe("ConfirmedTransactionDataCollection", ({ assert, beforeEach, it }) => {
	beforeEach(
		() =>
			(subject = new ConfirmedTransactionDataCollection(
				[
					{
						id: () => "id",

						recipient: () => "recipient",

						sender: () => "sender",
						timestamp: () => "timestamp",
						type: () => "type",
					},
				],
				{ next: "", prev: "", self: "" },
			)),
	);

	it("should find transactions by id", () => {
		assert.object(subject.findById("id"));
	});

	it("should find transactions by type", () => {
		assert.object(subject.findByType("type"));
	});

	it("should find transactions by timestamp", () => {
		assert.object(subject.findByTimestamp("timestamp"));
	});

	it("should find transactions by sender", () => {
		assert.object(subject.findBySender("sender"));
	});

	it("should find transactions by recipient", () => {
		assert.object(subject.findByRecipient("recipient"));
	});
});
