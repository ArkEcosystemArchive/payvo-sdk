import { assert, test } from "@payvo/sdk-test";
import { ConfirmedTransactionDataCollection } from "./transactions.collection";

let subject;

test.before.each(
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

test("#findById", () => {
	assert.object(subject.findById("id"));
});

test("#findByType", () => {
	assert.object(subject.findByType("type"));
});

test("#findByTimestamp", () => {
	assert.object(subject.findByTimestamp("timestamp"));
});

test("#findBySender", () => {
	assert.object(subject.findBySender("sender"));
});

test("#findByRecipient", () => {
	assert.object(subject.findByRecipient("recipient"));
});

test.run();
