import { isRegExp } from "./is-reg-exp";

test("#isRegExp", () => {
	test("should pass", () => {
		assert.is(isRegExp(/a/), true);
	});

	test("should fail", () => {
		assert.is(isRegExp([]), false);
	});
