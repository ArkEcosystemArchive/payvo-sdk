import { flatten } from "./flatten.js";

describe("#flatten", () => {
	it("should return a flattened array", () => {
		assert.is(flatten([1, [2, 3], [4, [5, [6, 7]]]]), [1, 2, 3, 4, 5, 6, 7]);
		assert.is(flatten([1, [2, 3], 4, [5, [6, [7], 8], 9], 10]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
	});
});
