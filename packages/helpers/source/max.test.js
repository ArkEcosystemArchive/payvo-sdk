import { assert, test } from "@payvo/sdk-test";

import { max } from "./max";

test("should return the largest number", () => {
	assert.is(max([1, 2, 3, 4, 5]), 5);
});

test.run();
