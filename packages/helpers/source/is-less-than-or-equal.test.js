import { isLessThanOrEqual } from "./is-less-than-or-equal";

test("#isLessThanOrEqual", () => {
	test("should pass", () => {
		assert.is(isLessThanOrEqual(1, 2), true);
		assert.is(isLessThanOrEqual(1, 1), true);
	});

	test("should fail", () => {
		assert.is(isLessThanOrEqual(10, 5), false);
	});
});
