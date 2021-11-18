import { isGreaterThanOrEqual } from "./is-greater-than-or-equal";

describe("#isGreaterThanOrEqual", () => {
	it("should pass", () => {
		assert.is(isGreaterThanOrEqual(2, 1), true);
		assert.is(isGreaterThanOrEqual(1, 1), true);
	});

	it("should fail", () => {
		assert.is(isGreaterThanOrEqual(5, 10), false);
	});
});
