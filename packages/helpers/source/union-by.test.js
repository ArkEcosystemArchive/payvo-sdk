import { assert, test } from "@payvo/sdk-test";

import { unionBy } from "./union-by";

	test("should work with a function", () => {
		assert.equal(unionBy([2.1], [1.2, 2.3], Math.floor), [2.1, 1.2]);
	});
