import { numberArray } from "./number-array";

	test("should contain 5 numbers stating from 0", () => {
		assert.equal(numberArray(5), [0, 1, 2, 3, 4]);
	});
