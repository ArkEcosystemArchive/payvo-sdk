import { isEmpty } from "./is-empty";

describe("#isEmpty", () => {
	test("should return true for an empty array", () => {
		assert.is(isEmpty([]), true);
	});

	test("should return true for an empty object", () => {
		assert.is(isEmpty({}), true);
	});

	test("should return true for a false boolean", () => {
		assert.is(isEmpty(false), true);
	});

	test("should return true for null", () => {
		assert.is(isEmpty(null), true);
	});

	test("should return true for undefined", () => {
		assert.is(isEmpty(undefined), true);
	});

	test("should return true for an empty map", () => {
		assert.is(isEmpty(new Map()), true);
	});

	test("should return true for an empty set", () => {
		assert.is(isEmpty(new Set()), true);
	});

	test("should return false if the value contains something", () => {
		assert.is(isEmpty([1]), false);
	});
});
