import { sortByDesc } from "./sort-by-desc";

const dummies = [
	{ name: "Andrew", age: 18 },
	{ name: "Bob", age: 18 },
	{ name: "John", age: 30 },
	{ name: "Jane", age: 40 },
];

test("#sortByDesc", () => {
	test("should sort records without iteratees", () => {
		assert.is(sortByDesc([...dummies]), [
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Bob", age: 18 },
			{ name: "Andrew", age: 18 },
		]);
	});

	test("should sort records by string", () => {
		assert.is(sortByDesc([...dummies], "age"), [
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});

	test("should sort records by array", () => {
		assert.is(sortByDesc([...dummies], ["age"]), [
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});
