import { orderBy } from "./order-by";

const dummies = [
	{ age: 18, name: "Andrew" },
	{ age: 18, name: "Bob" },
	{ age: 30, name: "John" },
	{ age: 40, name: "Jane" },
];

test("#orderBy", () => {
	test("should sort records by youngest age (with string params)", () => {
		assert.is(orderBy(dummies, "age", "asc"), [
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 30, name: "John" },
			{ age: 40, name: "Jane" },
		]);
	});

	test("should sort records by youngest age (with function params)", () => {
		assert.is(
			orderBy(dummies, (value) => value.age, "asc"),
			[
				{ age: 18, name: "Andrew" },
				{ age: 18, name: "Bob" },
				{ age: 30, name: "John" },
				{ age: 40, name: "Jane" },
			],
		);
	});

	test("should sort records by oldest age (with string params)", () => {
		assert.is(orderBy(dummies, "age", "desc"), [
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});

	test("should sort records by oldest age (with function params)", () => {
		assert.is(
			orderBy(dummies, (value) => value.age, "desc"),
			[
				{ age: 40, name: "Jane" },
				{ age: 30, name: "John" },
				{ age: 18, name: "Andrew" },
				{ age: 18, name: "Bob" },
			],
		);
	});

	test("should sort records by youngest age (with array params)", () => {
		assert.is(orderBy(dummies, ["name", "age"], ["asc", "asc"]), [
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
		]);
	});

	test("should sort records by oldest age (with array params)", () => {
		assert.is(orderBy(dummies, ["name", "age"], ["asc", "desc"]), [
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
		]);
	});
