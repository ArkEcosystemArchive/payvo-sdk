import { isRegExp } from "./is-reg-exp.js";

describe("#isRegExp", () => {
	it("should pass", () => {
		assert.is(isRegExp(/a/), true);
	});

	it("should fail", () => {
		assert.is(isRegExp([]), false);
	});
});
