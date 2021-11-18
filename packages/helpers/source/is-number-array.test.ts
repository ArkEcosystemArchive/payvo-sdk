import { isNumberArray } from "./is-number-array.js";

describe("#isNumberArray", () => {
	it("should pass", () => {
		assert.is(isNumberArray([1]), true);
	});

	it("should fail", () => {
		assert.is(isNumberArray(["string"]), false);
	});
});
