import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";

let subject;

const dummy = {
	id: () => "id",
	type: () => "type",
	// @ts-ignore
	timestamp: () => "timestamp",
	sender: () => "sender",
	recipient: () => "recipient",
};

test.before.each(() => {
	// @ts-ignore
	subject = new ExtendedConfirmedTransactionDataCollection([dummy], { prev: 1, self: 2, next: 3, last: 3 });
});

test("#findById", () => {
	assert.is(subject.findById("id"), dummy);
});

test("#findByType", () => {
	assert.is(subject.findByType("type"), dummy);
});

test("#findByTimestamp", () => {
	assert.is(subject.findByTimestamp("timestamp"), dummy);
});

test("#findBySender", () => {
	assert.is(subject.findBySender("sender"), dummy);
});

test("#findByRecipient", () => {
	assert.is(subject.findByRecipient("recipient"), dummy);
});

test.run();
