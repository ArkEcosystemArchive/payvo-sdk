import { assert, test } from "@payvo/sdk-test";

import { tail } from "./tail";

	test("should return the array without the first item", () => {
		assert.equal(tail([1, 2, 3, 4, 5]), [2, 3, 4, 5]);
	});
