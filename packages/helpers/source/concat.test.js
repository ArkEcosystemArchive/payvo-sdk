import { assert, test } from "@payvo/sdk-test";

import { concat } from "./concat";

test("#concat", () => {
	test("should concatenate all values", () => {
		assert.is(concat([1], 2, [3], [[4]]), [1, 2, 3, [4]]);
	});
});
