import { reduceArray } from "./reduce-array.js";

describe("#reduceArray", () => {
	it("should work with a function", () => {
		expect(reduceArray([1, 2], (sum, n) => sum + n, 0)).toBe(3);
	});
});
