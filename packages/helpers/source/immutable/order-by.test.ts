import { orderBy } from "./order-by.js";

const dummies = [
	{ age: 18, name: "Andrew" },
	{ age: 18, name: "Bob" },
	{ age: 30, name: "John" },
	{ age: 40, name: "Jane" },
];

describe("#orderBy", () => {
	it("should sort records by youngest age (with string params)", () => {
		assert.is(orderBy(dummies, "age", "asc")).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 30, name: "John" },
			{ age: 40, name: "Jane" },
		]);
	});

	it("should sort records by youngest age (with function params)", () => {
		assert.is(orderBy(dummies, (value) => value.age, "asc")).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 30, name: "John" },
			{ age: 40, name: "Jane" },
		]);
	});

	it("should sort records by oldest age (with string params)", () => {
		assert.is(orderBy(dummies, "age", "desc")).toEqual([
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});

	it("should sort records by oldest age (with function params)", () => {
		assert.is(orderBy(dummies, (value) => value.age, "desc")).toEqual([
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});

	it("should sort records by youngest age (with array params)", () => {
		assert.is(orderBy(dummies, ["name", "age"], ["asc", "asc"])).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
		]);
	});

	it("should sort records by oldest age (with array params)", () => {
		assert.is(orderBy(dummies, ["name", "age"], ["asc", "desc"])).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
		]);
	});
});
