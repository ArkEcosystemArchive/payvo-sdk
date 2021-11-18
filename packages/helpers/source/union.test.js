import { union } from "./union";

describe("#union", () => {
	test("should work with any value", () => {
		assert.is(union([2], [1, 2]), [2, 1]);
	});
});
