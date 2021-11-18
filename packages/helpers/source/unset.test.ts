import { unset } from "./unset.js";

describe("#unset", () => {
	it("should return false if the target is not an object", () => {
		assert.is(unset([], "a.b.c"), false);
	});

	it("should return false if the path is not a string", () => {
		// @ts-ignore
		assert.is(unset({}, 123), false);
	});

	it("should not do anything if the object is not an object", () => {
		assert.is(unset([], "a.b.c"), false);
	});

	it("should work with a string or array as path", () => {
		const object = { a: { b: { c: 7 } } };

		unset(object, "a.b.c");

		assert.is(object, { a: { b: {} } });

		unset(object, "a.b.c");

		assert.is(object, { a: { b: {} } });
	});
});
