import { isLessThanOrEqual } from "./is-less-than-or-equal";

describe("#isLessThanOrEqual", () => {
	it("should pass", () => {
		assert.is(isLessThanOrEqual(1, 2), true);
		assert.is(isLessThanOrEqual(1, 1), true);
	});

	it("should fail", () => {
		assert.is(isLessThanOrEqual(10, 5), false);
	});
});
