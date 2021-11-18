import { assert, test } from "@payvo/sdk-test";

import { sortBy } from "./sort-by";

const dummies = [
	{ age: 30, name: "John" },
	{ age: 40, name: "Jane" },
	{ age: 18, name: "Andrew" },
	{ age: 18, name: "Bob" },
];

test("should sort records without iteratees", () => {
	assert.equal(sortBy(dummies), [
		{ age: 30, name: "John" },
		{ age: 40, name: "Jane" },
		{ age: 18, name: "Andrew" },
		{ age: 18, name: "Bob" },
	]);
});

test("should sort records by string", () => {
	assert.equal(sortBy(dummies, "age"), [
		{ age: 18, name: "Andrew" },
		{ age: 18, name: "Bob" },
		{ age: 30, name: "John" },
		{ age: 40, name: "Jane" },
	]);
});

test("should sort records by array", () => {
	assert.equal(sortBy(dummies, ["age"]), [
		{ age: 18, name: "Andrew" },
		{ age: 18, name: "Bob" },
		{ age: 30, name: "John" },
		{ age: 40, name: "Jane" },
	]);
});

test.run();
