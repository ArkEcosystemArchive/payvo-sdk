import { assert, test } from "@payvo/sdk-test";

import { get } from "./get";

test("should return the default value if the target is not an object", () => {
	assert.is(get([], "a.b.c", "defaultValue"), "defaultValue");
});

test("should return the default value if the path is not a string", () => {
	assert.is(get({}, 123, "defaultValue"), "defaultValue");
});

test("should not do anything if the object is not an object", () => {
	assert.undefined(get([], "a.b.c"));
});

test("should work with nested objects", () => {
	const object = { a: { b: { c: 3 } } };

	assert.is(get(object, "a.b.c"), 3);
	assert.is(get(object, "a.b.c.d", "default"), "default");
});

test("should exit early if it encounters an undefined value", () => {
	assert.undefined(get({ a: undefined }, "a.b"));
	assert.undefined(get({ a: null }, "a.b"));
});

test.run();
