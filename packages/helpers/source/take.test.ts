import { take } from "./take.js";

describe("#take", () => {
	it("should take the given number of items", () => {
		assert.is(take([1, 2, 3]), [1]);
		assert.is(take([1, 2, 3], 2), [1, 2]);
		assert.is(take([1, 2, 3], 5), [1, 2, 3]);
		assert.is(take([1, 2, 3], 0), []);
	});
});
