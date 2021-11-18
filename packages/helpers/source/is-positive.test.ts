import { isPositive } from "./is-positive.js";

describe("#isPositive", () => {
	it("should pass", () => {
		assert.is(isPositive(1), true);
	});

	it("should fail", () => {
		assert.is(isPositive(-1), false);
	});
});
