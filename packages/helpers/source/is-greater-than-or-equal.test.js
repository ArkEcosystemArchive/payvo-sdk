import { isGreaterThanOrEqual } from "./is-greater-than-or-equal";

test("#isGreaterThanOrEqual", () => {
	test("should pass", () => {
		assert.is(isGreaterThanOrEqual(2, 1), true);
		assert.is(isGreaterThanOrEqual(1, 1), true);
	});

	test("should fail", () => {
		assert.is(isGreaterThanOrEqual(5, 10), false);
	});
});
