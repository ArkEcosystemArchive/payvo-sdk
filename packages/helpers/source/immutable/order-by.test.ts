import { orderBy } from "./order-by";

const dummies = [
	{ age: 18, name: "Andrew" },
	{ age: 18, name: "Bob" },
	{ age: 30, name: "John" },
	{ age: 40, name: "Jane" },
];

describe("#orderBy", () => {
	it("should sort records by youngest age (with string params)", () => {
		expect(orderBy(dummies, "age", "asc")).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 30, name: "John" },
			{ age: 40, name: "Jane" },
		]);
	});

	it("should sort records by youngest age (with function params)", () => {
		expect(orderBy(dummies, (value) => value.age, "asc")).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 30, name: "John" },
			{ age: 40, name: "Jane" },
		]);
	});

	it("should sort records by oldest age (with string params)", () => {
		expect(orderBy(dummies, "age", "desc")).toEqual([
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});

	it("should sort records by oldest age (with function params)", () => {
		expect(orderBy(dummies, (value) => value.age, "desc")).toEqual([
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});

	it("should sort records by youngest age (with array params)", () => {
		expect(orderBy(dummies, ["name", "age"], ["asc", "asc"])).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
		]);
	});

	it("should sort records by oldest age (with array params)", () => {
		expect(orderBy(dummies, ["name", "age"], ["asc", "desc"])).toEqual([
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
		]);
	});
});
