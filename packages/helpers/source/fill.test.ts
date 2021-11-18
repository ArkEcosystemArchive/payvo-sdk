import { fill } from "./fill.js";

describe("#fill", () => {
	it("should work with an array", () => {
		assert.is(fill([1, 2, 3], "a")).toEqual(["a", "a", "a"]);
		assert.is(fill(Array(3), 2)).toEqual([2, 2, 2]);
		assert.is(fill([4, 6, 8, 10], "*", 1, 3)).toEqual([4, "*", "*", 10]);
	});
});
