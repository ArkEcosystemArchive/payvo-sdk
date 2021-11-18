import { unionBy } from "./union-by";

test("#unionBy", () => {
	test("should work with a function", () => {
		assert.is(unionBy([2.1], [1.2, 2.3], Math.floor), [2.1, 1.2]);
	});
});
