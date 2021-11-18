import { numberArray } from "./number-array";

test("#numberArray", () => {
	test("should contain 5 numbers stating from 0", () => {
		assert.is(numberArray(5), [0, 1, 2, 3, 4]);
	});
