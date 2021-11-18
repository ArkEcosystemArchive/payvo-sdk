import { assert, test } from "@payvo/sdk-test";

import { has } from "./has";

test("should return false if the target is not an object", () => {
	assert.false(has([], "a.b.c"));
});

test("should return false if the path is not a string", () => {
	// @ts-ignore
	assert.false(has({}, 123));
});

test("should not do anything if the object is not an object", () => {
	assert.false(has([], "a.b.c"));
});

test("should work like lodash", () => {
	const object = { a: { b: 2 } };

	assert.true(has(object, "a"));
	assert.true(has(object, "a.b"));
	assert.false(has(object, "c"));
	assert.true(has({ a: undefined }, "a"));
});

test("should exit early if it encounters a non-object value", () => {
	const object = { a: { b: 2 } };

	assert.false(has(object, "a.b.c"));
});

test.run();
