import { describe } from "@payvo/sdk-test";

import { Paginator } from "./paginator.js";

describe("Paginator", ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(
		(context) =>
			(context.subject = new Stub(
				[
					{
						id: (context) => "id1",

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

	it("#items", (context) => {
		assert.length(context.subject.items(), 2);
	});

	it("#first", (context) => {
		assert.object(context.subject.first());
	});

	it("#last", (context) => {
		assert.object(context.subject.last());
	});

	it("#previousPage", (context) => {
		assert.is(context.subject.previousPage(), 1);
	});

	it("#currentPage", (context) => {
		assert.is(context.subject.currentPage(), 2);
	});

	it("#nextPage", (context) => {
		assert.is(context.subject.nextPage(), 4);
	});

	it("#lastPage", (context) => {
		assert.is(context.subject.lastPage(), 4);
	});

	it("#hasMorePages", (context) => {
		assert.is(context.subject.hasMorePages(), true);
	});

	it("#isEmpty", (context) => {
		assert.is(context.subject.isEmpty(), false);
	});

	it("#isNotEmpty", (context) => {
		assert.is(context.subject.isNotEmpty(), true);
	});

	it("#transform", (context) => {
		assert.length(context.subject.items(), 2);

		context.subject.transform((data) => {
			data.id = `${data.id}-transformed`;

			return data;
		});

		assert.length(context.subject.items(context), 2);
	});

	it("#getPagination", (context) => {
		assert.object(context.subject.getPagination());
	});

	class Stub extends Paginator {}
});
