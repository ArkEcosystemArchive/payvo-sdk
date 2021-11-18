import { isEmpty } from "./is-empty";

describe("#isEmpty", () => {
	it("should return true for an empty array", () => {
		assert.is(isEmpty([]), true);
	});

	it("should return true for an empty object", () => {
		assert.is(isEmpty({}), true);
	});

	it("should return true for a false boolean", () => {
		assert.is(isEmpty(false), true);
	});

	it("should return true for null", () => {
		assert.is(isEmpty(null), true);
	});

	it("should return true for undefined", () => {
		assert.is(isEmpty(undefined), true);
	});

	it("should return true for an empty map", () => {
		assert.is(isEmpty(new Map()), true);
	});

	it("should return true for an empty set", () => {
		assert.is(isEmpty(new Set()), true);
	});

	it("should return false if the value contains something", () => {
		assert.is(isEmpty([1]), false);
	});
});
