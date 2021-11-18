import { isEqual } from "./is-equal";

describe("#isEqual", () => {
	it("should return true for the same strings", () => {
		assert.is(isEqual("true", "true"), true);
	});

	it("should return true for the same numbers", () => {
		assert.is(isEqual(1, 1), true);
	});

	it("should return true for the same booleans", () => {
		assert.is(isEqual(true, true), true);
	});

	it("should return true for the same objects", () => {
		assert.is(isEqual({}, {}), true);
	});

	it("should return true for the same arrays", () => {
		assert.is(isEqual([], []), true);
	});

	it("should return true for the same nulls", () => {
		assert.is(isEqual(null, null), true);
	});
});
