import { sortByDesc } from "./sort-by-desc";

const dummies = [
	{ age: 18, name: "Andrew" },
	{ age: 18, name: "Bob" },
	{ age: 30, name: "John" },
	{ age: 40, name: "Jane" },
];

describe("#sortByDesc", () => {
	it("should sort records without iteratees", () => {
		expect(sortByDesc(dummies)).toEqual([
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Bob" },
			{ age: 18, name: "Andrew" },
		]);
	});

	it("should sort records by string", () => {
		expect(sortByDesc(dummies, "age")).toEqual([
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});

	it("should sort records by array", () => {
		expect(sortByDesc(dummies, ["age"])).toEqual([
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});
});
