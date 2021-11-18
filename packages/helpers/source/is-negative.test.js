import { assert, test } from "@payvo/sdk-test";

import { isNegative } from "./is-negative";

test("should pass", () => {
	assert.true(isNegative(-1));
});

test("should fail", () => {
	assert.false(isNegative(1));
});
