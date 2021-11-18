import { assert, test } from "@payvo/sdk-test";

import { numberArray } from "./number-array";
import { shuffle } from "./shuffle";

test("should return a new array with items in random order", () => {
	const possibleValues = numberArray(100);
	const shuffledValues = shuffle(possibleValues);

	assert.includeAllMembers(shuffledValues, possibleValues);
	assert.not.equal(shuffledValues, possibleValues);
});

test.run();
