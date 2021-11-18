import { assert, test } from "@payvo/sdk-test";

import { isNotBetween } from "./is-not-between";

test("should pass", () => {
	assert.true(isNotBetween(1, 2, 3));
});

test("should fail", () => {
	assert.false(isNotBetween(2, 1, 3));
});

test.run();
