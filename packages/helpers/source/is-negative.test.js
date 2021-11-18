import { isNegative } from "./is-negative";

test("#isNegative", () => {
	test("should pass", () => {
		assert.is(isNegative(-1), true);
	});

	test("should fail", () => {
		assert.is(isNegative(1), false);
	});
});
