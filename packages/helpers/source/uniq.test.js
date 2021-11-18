import { assert, test } from "@payvo/sdk-test";

import { uniq } from "./uniq";

test("should remove duplicate items", () => {
	assert.equal(uniq([2, 1, 2]), [2, 1]);
});

test.run();
