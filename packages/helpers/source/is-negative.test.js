import { isNegative } from "./is-negative";

describe("#isNegative", () => {
	test("should pass", () => {
		assert.is(isNegative(-1), true);
	});

	test("should fail", () => {
		assert.is(isNegative(1), false);
	});
});
