import { assert, test } from "@payvo/sdk-test";

import { concat } from "./concat";

test("should concatenate all values", () => {
	assert.equal(concat([1], 2, [3], [[4]]), [1, 2, 3, [4]]);
});

test.run();
