import { includes } from "./includes";

describe("#includes", () => {
	test("should work with a function", () => {
		assert.is(includes([1, 2, 3], 1), true);

		assert.is(includes([1, 2, 3], 4), false);

		assert.is(includes({ a: 1, b: 2 }, 1), true);

		assert.is(includes("abcd", "bc"), true);

		assert.is(includes(1, 2), false);
	});
});
