import { isPositiveZero } from "./is-positive-zero.js";

describe("#isPositiveZero", () => {
	it("should pass", () => {
		assert.is(isPositiveZero(+0), true);
		assert.is(isPositiveZero(0), true);
	});

	it("should fail", () => {
		assert.is(isPositiveZero(-0), false);
		assert.is(isPositiveZero(-1), false);
	});
});
