import { uniq } from "./uniq";

test("#uniq", () => {
	test("should remove duplicate items", () => {
		assert.is(uniq([2, 1, 2]), [2, 1]);
	});
});
