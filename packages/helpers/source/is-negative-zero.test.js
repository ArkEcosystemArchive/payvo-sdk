import { assert, test } from "@payvo/sdk-test";

import { isNegativeZero } from "./is-negative-zero";

test("should pass", () => {
	assert.true(isNegativeZero(-0));
});

test("should fail", () => {
	assert.false(isNegativeZero(+0));
	assert.false(isNegativeZero(0));
	assert.false(isNegativeZero(-1));
});

test.run();
