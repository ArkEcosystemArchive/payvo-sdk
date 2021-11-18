import { isNegative } from "./is-negative.js";

describe("#isNegative", () => {
	it("should pass", () => {
		assert.is(isNegative(-1), true);
	});

	it("should fail", () => {
		assert.is(isNegative(1), false);
	});
});
