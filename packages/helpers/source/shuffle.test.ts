import { numberArray } from "./number-array.js";
import { shuffle } from "./shuffle.js";

describe("#shuffle", () => {
	it("should return a new array with items in random order", () => {
		const possibleValues: number[] = numberArray(100);

		const shuffledValues: number[] = shuffle(possibleValues);

		assert.is(shuffledValues).toIncludeAllMembers(possibleValues);
		assert.is(shuffledValues).not.toEqual(possibleValues);
	});
});
