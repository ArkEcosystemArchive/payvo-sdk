import "jest-extended";

import { isRegExp } from "./is-reg-exp.js";

describe("#isRegExp", () => {
	it("should pass", () => {
		expect(isRegExp(/a/)).toBeTrue();
	});

	it("should fail", () => {
		expect(isRegExp([])).toBeFalse();
	});
});
