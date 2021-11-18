import { assert, test } from "@payvo/sdk-test";

import { cloneArray } from "./clone-array";

test("#cloneArray", () => {
	test("should work like lodash", () => {
		const objects = [{ a: 1 }, { b: 2 }];

		assert.is(cloneArray(objects), objects);
	});
