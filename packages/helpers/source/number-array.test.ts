import { numberArray } from "./number-array.js";

describe("#numberArray", () => {
	it("should contain 5 numbers stating from 0", () => {
		assert.is(numberArray(5)).toEqual([0, 1, 2, 3, 4]);
	});
});
