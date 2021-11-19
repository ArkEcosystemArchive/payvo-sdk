import { assert, test } from "@payvo/sdk-test";
import { Paginator } from "./paginator";

let subject;

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
	assert.length(subject.items(), 2);
});

test("#first", () => {
	assert.object(subject.first());
});

test("#last", () => {
	assert.object(subject.last());
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
	assert.length(subject.items(), 2);

	subject.transform((data) => {
		data.id = `${data.id}-transformed`;

		return data;
	});

	assert.length(subject.items(), 2);
});

test("#getPagination", () => {
	assert.object(subject.getPagination());
});

class Stub extends Paginator {}

test.run();
