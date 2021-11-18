import { concat } from "./concat";

describe("#concat", () => {
	test("should concatenate all values", () => {
		assert.is(concat([1], 2, [3], [[4]]), [1, 2, 3, [4]]);
	});
});
