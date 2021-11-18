import { max } from "./max.js";

describe("#max", () => {
	it("should return the largest number", () => {
		assert.is(max([1, 2, 3, 4, 5]), 5);
	});
});
