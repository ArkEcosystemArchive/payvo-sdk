import { assert, test } from "@payvo/sdk-test";

import { isPositiveZero } from "./is-positive-zero";

test("should pass", () => {
	assert.true(isPositiveZero(+0));
	assert.true(isPositiveZero(0));
});

test("should fail", () => {
	assert.false(isPositiveZero(-0));
	assert.false(isPositiveZero(-1));
});

test.run();
