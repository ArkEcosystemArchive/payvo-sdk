import { Paginator } from "./paginator";

let subject: Stub;

test.before.each(
	() =>
		(subject = new Stub(
			[
				{
					id: () => "id1",

					recipient: () => "recipient1",

					sender: () => "sender1",
					// @ts-ignore
					timestamp: () => "timestamp1",
					type: () => "type1",
				},
				{
					id: () => "id2",

					recipient: () => "recipient2",

					sender: () => "sender2",
					// @ts-ignore
					timestamp: () => "timestamp2",
					type: () => "type2",
				},
			],
			{ last: 4, next: 4, prev: 1, self: 2 },
		)),
);

test("#items", () => {
	assert.is(subject.items()).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "id": [Function],
		    "recipient": [Function],
		    "sender": [Function],
		    "timestamp": [Function],
		    "type": [Function],
		  },
		  Object {
		    "id": [Function],
		    "recipient": [Function],
		    "sender": [Function],
		    "timestamp": [Function],
		    "type": [Function],
		  },
		]
	`);
});

test("#first", () => {
	assert.is(subject.first()).toMatchInlineSnapshot(`
		Object {
		  "id": [Function],
		  "recipient": [Function],
		  "sender": [Function],
		  "timestamp": [Function],
		  "type": [Function],
		}
	`);
});

test("#last", () => {
	assert.is(subject.last()).toMatchInlineSnapshot(`
		Object {
		  "id": [Function],
		  "recipient": [Function],
		  "sender": [Function],
		  "timestamp": [Function],
		  "type": [Function],
		}
	`);
});

test("#previousPage", () => {
	assert.is(subject.previousPage(), 1);
});

test("#currentPage", () => {
	assert.is(subject.currentPage(), 2);
});

test("#nextPage", () => {
	assert.is(subject.nextPage(), 4);
});

test("#lastPage", () => {
	assert.is(subject.lastPage(), 4);
});

test("#hasMorePages", () => {
	assert.is(subject.hasMorePages(), true);
});

test("#isEmpty", () => {
	assert.is(subject.isEmpty(), false);
});

test("#isNotEmpty", () => {
	assert.is(subject.isNotEmpty(), true);
});

test("#transform", () => {
	assert.is(subject.items()).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "id": [Function],
		    "recipient": [Function],
		    "sender": [Function],
		    "timestamp": [Function],
		    "type": [Function],
		  },
		  Object {
		    "id": [Function],
		    "recipient": [Function],
		    "sender": [Function],
		    "timestamp": [Function],
		    "type": [Function],
		  },
		]
	`);

	subject.transform((data) => {
		data.id = `${data.id}-transformed`;

		return data;
	});

	assert.is(subject.items()).toMatchInlineSnapshot(`
		Array [
		  Object {
		    "id": "() => \\"id1\\"-transformed",
		    "recipient": [Function],
		    "sender": [Function],
		    "timestamp": [Function],
		    "type": [Function],
		  },
		  Object {
		    "id": "() => \\"id2\\"-transformed",
		    "recipient": [Function],
		    "sender": [Function],
		    "timestamp": [Function],
		    "type": [Function],
		  },
		]
	`);
});

test("#getPagination", () => {
	assert.is(subject.getPagination()).toMatchInlineSnapshot(`
		Object {
		  "last": 4,
		  "next": 4,
		  "prev": 1,
		  "self": 2,
		}
	`);
});

class Stub extends Paginator<any> {}
