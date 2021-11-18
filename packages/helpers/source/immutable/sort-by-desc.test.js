import { sortByDesc } from "./sort-by-desc";

const dummies = [
	{ age: 18, name: "Andrew" },
	{ age: 18, name: "Bob" },
	{ age: 30, name: "John" },
	{ age: 40, name: "Jane" },
];

	test("should sort records without iteratees", () => {
		assert.equal(sortByDesc(dummies), [
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Bob" },
			{ age: 18, name: "Andrew" },
		]);
	});

	test("should sort records by string", () => {
		assert.equal(sortByDesc(dummies, "age"), [
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});

	test("should sort records by array", () => {
		assert.equal(sortByDesc(dummies, ["age"]), [
			{ age: 40, name: "Jane" },
			{ age: 30, name: "John" },
			{ age: 18, name: "Andrew" },
			{ age: 18, name: "Bob" },
		]);
	});
