import { isStringArray } from "./is-string-array.js";

describe("#isStringArray", () => {
	it("should pass", () => {
		assert.is(isStringArray(["string"]), true);
	});

	it("should fail", () => {
		assert.is(isStringArray([1]), false);
	});
});
