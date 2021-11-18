import { assert, test } from "@payvo/sdk-test";

import { randomNumber } from "./random-number";

test("should return a random number within the given range", () => {
	const actual = randomNumber(1, 5);

	assert.gte(actual, 1);
	assert.lte(actual, 5);
});

test.run();
