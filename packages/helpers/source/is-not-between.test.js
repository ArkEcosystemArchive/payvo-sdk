import { isNotBetween } from "./is-not-between";

test("#isNotBetween", () => {
	test("should pass", () => {
		assert.is(isNotBetween(1, 2, 3), true);
	});

	test("should fail", () => {
		assert.is(isNotBetween(2, 1, 3), false);
	});
