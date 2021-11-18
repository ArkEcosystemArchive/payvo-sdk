import { assert, test } from "@payvo/sdk-test";

import { isNil } from "./is-nil";

test("should pass", () => {
	assert.true(isNil(undefined));
	assert.true(isNil(null));
});

test("should fail", () => {
	assert.false(isNil("undefined"));
	assert.false(isNil("null"));
});
