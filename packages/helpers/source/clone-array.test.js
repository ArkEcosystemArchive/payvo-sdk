import { assert, test } from "@payvo/sdk-test";

import { cloneArray } from "./clone-array";

	test("should work like lodash", () => {
		const objects = [{ a: 1 }, { b: 2 }];

		assert.equal(cloneArray(objects), objects);
	});
