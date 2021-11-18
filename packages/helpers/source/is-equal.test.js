import { assert, test } from "@payvo/sdk-test";

import { isEqual } from "./is-equal";

test("should return true for the same strings", () => {
	assert.true(isEqual("true", "true"));
});

test("should return true for the same numbers", () => {
	assert.true(isEqual(1, 1));
});

test("should return true for the same booleans", () => {
	assert.true(isEqual(true, true));
});

test("should return true for the same objects", () => {
	assert.true(isEqual({}, {}));
});

test("should return true for the same arrays", () => {
	assert.true(isEqual([], []));
});

test("should return true for the same nulls", () => {
	assert.true(isEqual(null, null));
});
