import { assert, test } from "@payvo/sdk-test";

import { isStringArray } from "./is-string-array";

	test("should pass", () => {
		assert.true(isStringArray(["string"]));
	});

	test("should fail", () => {
		assert.false(isStringArray([1]));
	});
