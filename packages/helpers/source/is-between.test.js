import { assert, test } from "@payvo/sdk-test";

import { isBetween } from "./is-between";

test("should pass", () => {
	assert.true(isBetween(2, 1, 3));
});

test("should fail", () => {
	assert.false(isBetween(1, 2, 3));
});

test.run();