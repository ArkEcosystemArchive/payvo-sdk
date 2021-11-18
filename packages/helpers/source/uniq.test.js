import { uniq } from "./uniq";

	test("should remove duplicate items", () => {
		assert.equal(uniq([2, 1, 2]), [2, 1]);
});
