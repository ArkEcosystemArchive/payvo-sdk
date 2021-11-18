import { sortBy } from "./sort-by";

const dummies = [
	{ name: "John", age: 30 },
	{ name: "Jane", age: 40 },
	{ name: "Andrew", age: 18 },
	{ name: "Bob", age: 18 },
];

test("#sortBy", () => {
	test("should sort records without iteratees", () => {
		assert.is(sortBy([...dummies]), [
			{ name: "John", age: 30 },
			{ name: "Jane", age: 40 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});

	test("should sort records by string", () => {
		assert.is(sortBy([...dummies], "age"), [
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
			{ name: "John", age: 30 },
			{ name: "Jane", age: 40 },
		]);
	});

	test("should sort records by array", () => {
		assert.is(sortBy([...dummies], ["age"]), [
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
			{ name: "John", age: 30 },
			{ name: "Jane", age: 40 },
		]);
	});
