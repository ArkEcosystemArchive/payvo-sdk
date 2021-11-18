import { isPositive } from "./is-positive";

describe("#isPositive", () => {
	test("should pass", () => {
		assert.is(isPositive(1), true);
	});

	test("should fail", () => {
		assert.is(isPositive(-1), false);
	});
});
