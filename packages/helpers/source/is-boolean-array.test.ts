import { isBooleanArray } from "./is-boolean-array.js";

describe("#isBooleanArray", () => {
	it("should pass", () => {
		assert.is(isBooleanArray([true]), true);
	});

	it("should fail", () => {
		assert.is(isBooleanArray([1]), false);
	});
});
