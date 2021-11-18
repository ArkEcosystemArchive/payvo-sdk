import { assert, test } from "@payvo/sdk-test";

import { isFunction } from "./is-function";

test("should pass", () => {
	assert.true(isFunction(new Function()));
	assert.true(isFunction(async () => ({})));
});

test("should fail", () => {
	assert.false(isFunction([]));
});

test.run();
