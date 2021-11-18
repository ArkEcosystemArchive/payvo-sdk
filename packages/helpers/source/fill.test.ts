import { fill } from "./fill.js";

describe("#fill", () => {
	it("should work with an array", () => {
		assert.is(fill([1, 2, 3], "a"), ["a", "a", "a"]);
		assert.is(fill(Array(3), 2), [2, 2, 2]);
		assert.is(fill([4, 6, 8, 10], "*", 1, 3), [4, "*", "*", 10]);
	});
});
