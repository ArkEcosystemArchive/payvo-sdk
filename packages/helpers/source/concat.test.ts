import { concat } from "./concat.js";

describe("#concat", () => {
	it("should concatenate all values", () => {
		assert.is(concat([1], 2, [3], [[4]])).toEqual([1, 2, 3, [4]]);
	});
});
