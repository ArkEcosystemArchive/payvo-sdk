import { isString } from "./is-string.js";

describe("#isString", () => {
	it("should pass", () => {
		assert.is(isString("string"), true);
	});

	it("should fail", () => {
		assert.is(isString(1), false);
	});
});
