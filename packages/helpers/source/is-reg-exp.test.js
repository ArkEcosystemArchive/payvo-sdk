import { isRegExp } from "./is-reg-exp";

describe("#isRegExp", () => {
	test("should pass", () => {
		assert.is(isRegExp(/a/), true);
	});

	test("should fail", () => {
		assert.is(isRegExp([]), false);
	});
});
