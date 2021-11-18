import { assert, test } from "@payvo/sdk-test";

import { sortBy } from "./sort-by";

const dummies = [
	{ name: "John", age: 30 },
	{ name: "Jane", age: 40 },
	{ name: "Andrew", age: 18 },
	{ name: "Bob", age: 18 },
];

	test("should sort records without iteratees", () => {
		assert.equal(sortBy([...dummies]), [
			{ name: "John", age: 30 },
			{ name: "Jane", age: 40 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});

	test("should sort records by string", () => {
		assert.equal(sortBy([...dummies], "age"), [
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
			{ name: "John", age: 30 },
			{ name: "Jane", age: 40 },
		]);
	});

	test("should sort records by array", () => {
		assert.equal(sortBy([...dummies], ["age"]), [
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
			{ name: "John", age: 30 },
			{ name: "Jane", age: 40 },
		]);
	});
