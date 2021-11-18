import { assert, test } from "@payvo/sdk-test";

import { isBooleanArray } from "./is-boolean-array";

test("should pass", () => {
	assert.true(isBooleanArray([true]));
});

test("should fail", () => {
	assert.false(isBooleanArray([1]));
});

test.run();
