import { isArray } from "./is-array.js";

describe("#isArray", () => {
	it("should pass", () => {
		assert.is(isArray([1]), true);
	});

	it("should fail", () => {
		assert.is(isArray(1), false);
	});
});
