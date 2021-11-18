import { isPositive } from "./is-positive";

	test("should pass", () => {
		assert.true(isPositive(1));
	});

	test("should fail", () => {
		assert.false(isPositive(-1));
	});
