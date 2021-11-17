import "jest-extended";

import { isNegativeZero } from "./is-negative-zero.js";

describe("#isNegativeZero", () => {
	it("should pass", () => {
		expect(isNegativeZero(-0)).toBeTrue();
	});

	it("should fail", () => {
		expect(isNegativeZero(+0)).toBeFalse();
		expect(isNegativeZero(0)).toBeFalse();
		expect(isNegativeZero(-1)).toBeFalse();
	});
});
