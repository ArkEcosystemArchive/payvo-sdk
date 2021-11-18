import { isPositiveZero } from "./is-positive-zero";

test("#isPositiveZero", () => {
	test("should pass", () => {
		assert.is(isPositiveZero(+0), true);
		assert.is(isPositiveZero(0), true);
	});

	test("should fail", () => {
		assert.is(isPositiveZero(-0), false);
		assert.is(isPositiveZero(-1), false);
	});
});
