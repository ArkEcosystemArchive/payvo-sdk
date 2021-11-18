import { ConfirmedTransactionDataCollection } from "./transactions.js";

let subject: ConfirmedTransactionDataCollection;

test.before.each(
	() =>
		(subject = new ConfirmedTransactionDataCollection(
			[
				// @ts-ignore
				{
					id: () => "id",

					recipient: () => "recipient",

					sender: () => "sender",
					// @ts-ignore
					timestamp: () => "timestamp",
					type: () => "type",
				},
			],
			{ next: "", prev: "", self: "" },
		)),
);

test("#findById", () => {
	assert.is(subject.findById("id")).toMatchInlineSnapshot(`
		Object {
		  "id": [Function],
		  "recipient": [Function],
		  "sender": [Function],
		  "timestamp": [Function],
		  "type": [Function],
		}
	`);
});

test("#findByType", () => {
	assert.is(subject.findByType("type")).toMatchInlineSnapshot(`
		Object {
		  "id": [Function],
		  "recipient": [Function],
		  "sender": [Function],
		  "timestamp": [Function],
		  "type": [Function],
		}
	`);
});

test("#findByTimestamp", () => {
	assert.is(subject.findByTimestamp("timestamp")).toMatchInlineSnapshot(`
		Object {
		  "id": [Function],
		  "recipient": [Function],
		  "sender": [Function],
		  "timestamp": [Function],
		  "type": [Function],
		}
	`);
});

test("#findBySender", () => {
	assert.is(subject.findBySender("sender")).toMatchInlineSnapshot(`
		Object {
		  "id": [Function],
		  "recipient": [Function],
		  "sender": [Function],
		  "timestamp": [Function],
		  "type": [Function],
		}
	`);
});

test("#findByRecipient", () => {
	assert.is(subject.findByRecipient("recipient")).toMatchInlineSnapshot(`
		Object {
		  "id": [Function],
		  "recipient": [Function],
		  "sender": [Function],
		  "timestamp": [Function],
		  "type": [Function],
		}
	`);
});
