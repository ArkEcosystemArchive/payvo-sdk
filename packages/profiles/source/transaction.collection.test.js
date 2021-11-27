import { describe } from "@payvo/sdk-test";
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

describe("ExtendedConfirmedTransactionDataCollection", ({
	beforeAll,
	beforeEach,
	loader,
	nock,
	assert,
	test,
	stub,
}) => {
	beforeEach(() => {
		// @ts-ignore
		subject = new ExtendedConfirmedTransactionDataCollection([dummy], { prev: 1, self: 2, next: 3, last: 3 });
	});

	it("#findById", () => {
		assert.is(subject.findById("id"), dummy);
	});

	it("#findByType", () => {
		assert.is(subject.findByType("type"), dummy);
	});

	it("#findByTimestamp", () => {
		assert.is(subject.findByTimestamp("timestamp"), dummy);
	});

	it("#findBySender", () => {
		assert.is(subject.findBySender("sender"), dummy);
	});

	it("#findByRecipient", () => {
		assert.is(subject.findByRecipient("recipient"), dummy);
	});
});
