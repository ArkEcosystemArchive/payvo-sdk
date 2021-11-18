import { assert, test } from "@payvo/sdk-test";

import { head } from "./head";

	test("should return the first item", () => {
		assert.is(head([1, 2, 3, 4, 5]), 1);
	});
