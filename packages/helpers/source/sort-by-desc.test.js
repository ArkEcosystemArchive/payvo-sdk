import { assert, test } from "@payvo/sdk-test";

import { sortByDesc } from "./sort-by-desc";

const dummies = [
	{ name: "Andrew", age: 18 },
	{ name: "Bob", age: 18 },
	{ name: "John", age: 30 },
	{ name: "Jane", age: 40 },
];

	test("should sort records without iteratees", () => {
		assert.equal(sortByDesc([...dummies]), [
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Bob", age: 18 },
			{ name: "Andrew", age: 18 },
		]);
	});

	test("should sort records by string", () => {
		assert.equal(sortByDesc([...dummies], "age"), [
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});

	test("should sort records by array", () => {
		assert.equal(sortByDesc([...dummies], ["age"]), [
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});
