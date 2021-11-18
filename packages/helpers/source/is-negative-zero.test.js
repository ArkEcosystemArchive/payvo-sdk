import { isNegativeZero } from "./is-negative-zero";

test("#isNegativeZero", () => {
	test("should pass", () => {
		assert.is(isNegativeZero(-0), true);
	});

	test("should fail", () => {
		assert.is(isNegativeZero(+0), false);
		assert.is(isNegativeZero(0), false);
		assert.is(isNegativeZero(-1), false);
	});
});
