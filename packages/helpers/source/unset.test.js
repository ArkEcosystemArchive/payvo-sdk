import { assert, test } from "@payvo/sdk-test";

import { unset } from "./unset";

	test("should return false if the target is not an object", () => {
		assert.false(unset([], "a.b.c"));
	});

	test("should return false if the path is not a string", () => {
		// @ts-ignore
		assert.false(unset({}, 123));
	});

	test("should not do anything if the object is not an object", () => {
		assert.false(unset([], "a.b.c"));
	});

	test("should work with a string or array as path", () => {
		const object = { a: { b: { c: 7 } } };

		unset(object, "a.b.c");

		assert.is(object, { a: { b: {} } });

		unset(object, "a.b.c");

		assert.is(object, { a: { b: {} } });
	});
