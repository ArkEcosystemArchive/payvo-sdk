import { assert, test } from "@payvo/sdk-test";

import { isGreaterThanOrEqual } from "./is-greater-than-or-equal";

test("should pass", () => {
	assert.true(isGreaterThanOrEqual(2, 1));
	assert.true(isGreaterThanOrEqual(1, 1));
});

test("should fail", () => {
	assert.false(isGreaterThanOrEqual(5, 10));
});

test.run();
