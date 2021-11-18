import { intersection } from "./intersection.js";

describe("#intersection", () => {
	it("should return the common values", () => {
		assert.is(intersection([2, 1], [2, 3])).toEqual([2]);
		assert.is(intersection([], [])).toEqual([]);
		assert.is(intersection(["a"], ["a"])).toEqual(["a"]);
		assert.is(intersection([true], [true])).toEqual([true]);
		assert.is(intersection([false], [false])).toEqual([false]);
	});
});
