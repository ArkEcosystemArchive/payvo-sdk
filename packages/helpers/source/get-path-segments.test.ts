import { getPathSegments } from "./get-path-segments.js";

describe("#getPathSegments", () => {
	it("should return an array as is", () => {
		assert.is(getPathSegments(["a", "b"])).toEqual(["a", "b"]);
	});

	it("should return the path as array", () => {
		assert.is(getPathSegments("a.b")).toEqual(["a", "b"]);
	});

	it("should return an empty array if any dangerous paths are used", () => {
		assert.is(getPathSegments("a.__proto__")).toEqual([]);
		assert.is(getPathSegments("a.prototype")).toEqual([]);
		assert.is(getPathSegments("a.constructor")).toEqual([]);
	});
});
