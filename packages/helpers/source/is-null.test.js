import { assert, test } from "@payvo/sdk-test";

import { isNull } from "./is-null";

test("should pass", () => {
	assert.true(isNull(null));
});

test("should fail", () => {
	assert.false(isNull("null"));
});

test.run();
