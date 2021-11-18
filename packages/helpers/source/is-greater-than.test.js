import { isGreaterThan } from "./is-greater-than";

test("#isGreaterThan", () => {
	test("should pass", () => {
		assert.is(isGreaterThan(2, 1), true);
	});

	test("should fail", () => {
		assert.is(isGreaterThan(1, 2), false);
	});
});
