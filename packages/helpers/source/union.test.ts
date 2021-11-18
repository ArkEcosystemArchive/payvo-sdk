import { union } from "./union.js";

describe("#union", () => {
	it("should work with any value", () => {
		assert.is(union([2], [1, 2])).toEqual([2, 1]);
	});
});
