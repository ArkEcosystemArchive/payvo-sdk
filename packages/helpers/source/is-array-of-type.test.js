import { assert, test } from "@payvo/sdk-test";

import { isArrayOfType } from "./is-array-of-type";

test("should pass", () => {
	assert.true(isArrayOfType([1], "number"));
});

test("should fail", () => {
	assert.false(isArrayOfType(["string"], "number"));
});

test.run();
