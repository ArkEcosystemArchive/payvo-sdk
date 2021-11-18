import { assert, test } from "@payvo/sdk-test";

import { orderBy } from "./order-by";

const dummies = [
	{ name: "Andrew", age: 18 },
	{ name: "Bob", age: 18 },
	{ name: "John", age: 30 },
	{ name: "Jane", age: 40 },
];

test("should sort records by youngest age (with string params)", () => {
	assert.equal(orderBy([...dummies], "age", "asc"), [
		{ name: "Andrew", age: 18 },
		{ name: "Bob", age: 18 },
		{ name: "John", age: 30 },
		{ name: "Jane", age: 40 },
	]);
});

test("should sort records by youngest age (with function params)", () => {
	assert.equal(
		orderBy([...dummies], (value) => value.age, "asc"),
		[
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
			{ name: "John", age: 30 },
			{ name: "Jane", age: 40 },
		],
	);
});

test("should sort records by oldest age (with string params)", () => {
	assert.equal(orderBy([...dummies], "age", "desc"), [
		{ name: "Jane", age: 40 },
		{ name: "John", age: 30 },
		{ name: "Andrew", age: 18 },
		{ name: "Bob", age: 18 },
	]);
});

test("should sort records by oldest age (with function params)", () => {
	assert.equal(
		orderBy([...dummies], (value) => value.age, "desc"),
		[
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		],
	);
});

test("should sort records by youngest age (with array params)", () => {
	assert.equal(orderBy([...dummies], ["name", "age"], ["asc", "asc"]), [
		{ name: "Andrew", age: 18 },
		{ name: "Bob", age: 18 },
		{ name: "Jane", age: 40 },
		{ name: "John", age: 30 },
	]);
});

test("should sort records by oldest age (with array params)", () => {
	assert.equal(orderBy([...dummies], ["name", "age"], ["asc", "desc"]), [
		{ name: "Andrew", age: 18 },
		{ name: "Bob", age: 18 },
		{ name: "Jane", age: 40 },
		{ name: "John", age: 30 },
	]);
});

test.run();
