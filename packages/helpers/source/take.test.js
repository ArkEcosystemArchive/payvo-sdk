import { assert, test } from "@payvo/sdk-test";

import { take } from "./take";

test("should take the given number of items", () => {
	assert.equal(take([1, 2, 3]), [1]);
	assert.equal(take([1, 2, 3], 2), [1, 2]);
	assert.equal(take([1, 2, 3], 5), [1, 2, 3]);
	assert.equal(take([1, 2, 3], 0), []);
});

test.run();