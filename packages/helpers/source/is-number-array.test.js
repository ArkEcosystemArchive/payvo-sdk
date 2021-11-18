import { assert, test } from "@payvo/sdk-test";

import { isNumberArray } from "./is-number-array";

	test("should pass", () => {
		assert.true(isNumberArray([1]));
	});

	test("should fail", () => {
		assert.false(isNumberArray(["string"]));
	});
