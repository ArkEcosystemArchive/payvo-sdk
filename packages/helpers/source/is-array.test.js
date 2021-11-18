import { isArray } from "./is-array";

describe("#isArray", () => {
	test("should pass", () => {
		assert.is(isArray([1]), true);
	});

	test("should fail", () => {
		assert.is(isArray(1), false);
	});
});
