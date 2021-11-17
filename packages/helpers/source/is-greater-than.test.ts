import "jest-extended";

import { isGreaterThan } from "./is-greater-than.js";

describe("#isGreaterThan", () => {
	it("should pass", () => {
		expect(isGreaterThan(2, 1)).toBeTrue();
	});

	it("should fail", () => {
		expect(isGreaterThan(1, 2)).toBeFalse();
	});
});
