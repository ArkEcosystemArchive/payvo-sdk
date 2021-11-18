import { last } from "./last.js";

describe("#last", () => {
	it("should return the last item", () => {
		assert.is(last([1, 2, 3, 4, 5]), 5);
	});
});
