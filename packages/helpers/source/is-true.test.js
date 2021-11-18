import { assert, test } from "@payvo/sdk-test";

import { isTrue } from "./is-true";

test("should pass", () => {
	assert.true(isTrue(true));
});

test("should fail", () => {
	assert.false(isTrue(false));
});

test.run();
