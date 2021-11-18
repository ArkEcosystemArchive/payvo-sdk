import { getPathSegments } from "./get-path-segments";

describe("#getPathSegments", () => {
	test("should return an array as is", () => {
		assert.is(getPathSegments(["a", "b"]), ["a", "b"]);
	});

	test("should return the path as array", () => {
		assert.is(getPathSegments("a.b"), ["a", "b"]);
	});

	test("should return an empty array if any dangerous paths are used", () => {
		assert.is(getPathSegments("a.__proto__"), []);
		assert.is(getPathSegments("a.prototype"), []);
		assert.is(getPathSegments("a.constructor"), []);
	});
});
