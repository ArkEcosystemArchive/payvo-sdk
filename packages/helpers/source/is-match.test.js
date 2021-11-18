import { isMatch } from "./is-match";

test("#isMatch", () => {
	test("should pass", () => {
		assert.is(isMatch("a", /a/), true);
	});

	test("should fail", () => {
		assert.is(isMatch(1, /a/), false);
	});
});
