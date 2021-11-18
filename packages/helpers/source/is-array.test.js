import { assert, test } from "@payvo/sdk-test";

import { isArray } from "./is-array";

test("should pass", () => {
	assert.true(isArray([1]));
});

test("should fail", () => {
	assert.false(isArray(1));
});

test.run();
