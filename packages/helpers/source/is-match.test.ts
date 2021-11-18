import { isMatch } from "./is-match.js";

describe("#isMatch", () => {
	it("should pass", () => {
		assert.is(isMatch("a", /a/), true);
	});

	it("should fail", () => {
		assert.is(isMatch(1, /a/), false);
	});
});
