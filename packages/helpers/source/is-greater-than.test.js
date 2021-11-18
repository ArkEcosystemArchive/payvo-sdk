import { assert, test } from "@payvo/sdk-test";

import { isGreaterThan } from "./is-greater-than";

test("should pass", () => {
	assert.true(isGreaterThan(2, 1));
});

test("should fail", () => {
	assert.false(isGreaterThan(1, 2));
});

test.run();
