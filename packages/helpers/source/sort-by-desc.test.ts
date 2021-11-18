import { sortByDesc } from "./sort-by-desc.js";

const dummies = [
	{ name: "Andrew", age: 18 },
	{ name: "Bob", age: 18 },
	{ name: "John", age: 30 },
	{ name: "Jane", age: 40 },
];

describe("#sortByDesc", () => {
	it("should sort records without iteratees", () => {
		assert.is(sortByDesc([...dummies])).toEqual([
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Bob", age: 18 },
			{ name: "Andrew", age: 18 },
		]);
	});

	it("should sort records by string", () => {
		assert.is(sortByDesc([...dummies], "age")).toEqual([
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});

	it("should sort records by array", () => {
		assert.is(sortByDesc([...dummies], ["age"])).toEqual([
			{ name: "Jane", age: 40 },
			{ name: "John", age: 30 },
			{ name: "Andrew", age: 18 },
			{ name: "Bob", age: 18 },
		]);
	});
});
