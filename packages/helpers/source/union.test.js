import { union } from "./union";

test("#union", () => {
	test("should work with any value", () => {
		assert.is(union([2], [1, 2]), [2, 1]);
	});
});
