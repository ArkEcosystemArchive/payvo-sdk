import { isNegativeZero } from "./is-negative-zero";

describe("#isNegativeZero", () => {
	it("should pass", () => {
		assert.is(isNegativeZero(-0), true);
	});

	it("should fail", () => {
		assert.is(isNegativeZero(+0), false);
		assert.is(isNegativeZero(0), false);
		assert.is(isNegativeZero(-1), false);
	});
});
