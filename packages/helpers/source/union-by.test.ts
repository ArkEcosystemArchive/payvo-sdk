import { unionBy } from "./union-by.js";

describe("#unionBy", () => {
	it("should work with a function", () => {
		assert.is(unionBy([2.1], [1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
	});
});
