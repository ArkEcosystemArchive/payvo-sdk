import { isMatch } from "./is-match.js";

describe("#isMatch", () => {
	it("should pass", () => {
		expect(isMatch("a", /a/)).toBeTrue();
	});

	it("should fail", () => {
		expect(isMatch(1, /a/)).toBeFalse();
	});
});
