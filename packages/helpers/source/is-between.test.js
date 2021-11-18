import { isBetween } from "./is-between";

describe("#isBetween", () => {
	test("should pass", () => {
		assert.is(isBetween(2, 1, 3), true);
	});

	test("should fail", () => {
		assert.is(isBetween(1, 2, 3), false);
	});
});
