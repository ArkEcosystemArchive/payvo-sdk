import { uniq } from "./uniq.js";

describe("#uniq", () => {
	it("should remove duplicate items", () => {
		assert.is(uniq([2, 1, 2])).toEqual([2, 1]);
	});
});
