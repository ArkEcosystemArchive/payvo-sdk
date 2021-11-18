import { assert, test } from "@payvo/sdk-test";

import { isLessThanOrEqual } from "./is-less-than-or-equal";

test("should pass", () => {
	assert.true(isLessThanOrEqual(1, 2));
	assert.true(isLessThanOrEqual(1, 1));
});

test("should fail", () => {
	assert.false(isLessThanOrEqual(10, 5));
});

test.run();
