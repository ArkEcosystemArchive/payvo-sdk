import { uniqBy } from "./uniq-by";

	test("should work with a function", () => {
		assert.equal(uniqBy([2.1, 1.2, 2.3], Math.floor), [2.1, 1.2]);
	});
