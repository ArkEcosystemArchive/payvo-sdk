import { assert, test } from "@payvo/sdk-test";

import { isRegExp } from "./is-reg-exp";

test("should pass", () => {
	assert.true(isRegExp(/a/));
});

test("should fail", () => {
	assert.false(isRegExp([]));
});

test.run();
