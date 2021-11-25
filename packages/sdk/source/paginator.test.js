import { describe } from "@payvo/sdk-test";
import { Paginator } from "./paginator";

let subject;

describe("Paginator", ({ assert, beforeEach, it }) => {
	beforeEach(
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

	it("#items", () => {
		assert.length(subject.items(), 2);
	});

	it("#first", () => {
		assert.object(subject.first());
	});

	it("#last", () => {
		assert.object(subject.last());
	});

	it("#previousPage", () => {
		assert.is(subject.previousPage(), 1);
	});

	it("#currentPage", () => {
		assert.is(subject.currentPage(), 2);
	});

	it("#nextPage", () => {
		assert.is(subject.nextPage(), 4);
	});

	it("#lastPage", () => {
		assert.is(subject.lastPage(), 4);
	});

	it("#hasMorePages", () => {
		assert.is(subject.hasMorePages(), true);
	});

	it("#isEmpty", () => {
		assert.is(subject.isEmpty(), false);
	});

	it("#isNotEmpty", () => {
		assert.is(subject.isNotEmpty(), true);
	});

	it("#transform", () => {
		assert.length(subject.items(), 2);

		subject.transform((data) => {
			data.id = `${data.id}-transformed`;

			return data;
		});

		assert.length(subject.items(), 2);
	});

	it("#getPagination", () => {
		assert.object(subject.getPagination());
	});

	class Stub extends Paginator {}
});
