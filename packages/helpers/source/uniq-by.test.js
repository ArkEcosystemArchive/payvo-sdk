import { uniqBy } from "./uniq-by";

describe("#uniqBy", () => {
	test("should work with a function", () => {
		assert.is(uniqBy([2.1, 1.2, 2.3], Math.floor), [2.1, 1.2]);
	});
});
