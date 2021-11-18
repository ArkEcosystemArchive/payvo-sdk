import { ExtendedConfirmedTransactionDataCollection } from "./transaction.collection";

let subject: ExtendedConfirmedTransactionDataCollection;

const dummy = {
	id: () => "id",
	type: () => "type",
	// @ts-ignore
	timestamp: () => "timestamp",
	sender: () => "sender",
	recipient: () => "recipient",
};

beforeEach(() => {
	// @ts-ignore
	subject = new ExtendedConfirmedTransactionDataCollection([dummy], { prev: 1, self: 2, next: 3, last: 3 });
});

test("#findById", () => {
	assert.is(subject.findById("id")).toEqual(dummy);
});

test("#findByType", () => {
	assert.is(subject.findByType("type")).toEqual(dummy);
});

test("#findByTimestamp", () => {
	assert.is(subject.findByTimestamp("timestamp")).toEqual(dummy);
});

test("#findBySender", () => {
	assert.is(subject.findBySender("sender")).toEqual(dummy);
});

test("#findByRecipient", () => {
	assert.is(subject.findByRecipient("recipient")).toEqual(dummy);
});
