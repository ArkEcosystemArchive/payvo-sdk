import { isMatch } from "./is-match";

	test("should pass", () => {
		assert.true(isMatch("a", /a/));
	});

	test("should fail", () => {
		assert.false(isMatch(1, /a/));
	});
