import { assert, test } from "@payvo/sdk-test";

import { reduceArray } from "./reduce-array";

test("should work with a function", () => {
	assert.is(
		reduceArray([1, 2], (sum, n) => sum + n, 0),
		3,
	);
});

test.run();
