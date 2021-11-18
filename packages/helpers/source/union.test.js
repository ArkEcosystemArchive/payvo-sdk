import { union } from "./union";

	test("should work with any value", () => {
		assert.equal(union([2], [1, 2]), [2, 1]);
	});
