import { isNegative } from "./is-negative";

describe("#isNegative", () => {
	it("should pass", () => {
		assert.is(isNegative(-1), true);
	});

	it("should fail", () => {
		assert.is(isNegative(1), false);
	});
});
