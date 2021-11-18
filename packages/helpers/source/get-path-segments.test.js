import { assert, test } from "@payvo/sdk-test";

import { getPathSegments } from "./get-path-segments";

	test("should return an array as is", () => {
		assert.equal(getPathSegments(["a", "b"]), ["a", "b"]);
	});

	test("should return the path as array", () => {
		assert.equal(getPathSegments("a.b"), ["a", "b"]);
	});

	test("should return an empty array if any dangerous paths are used", () => {
		assert.equal(getPathSegments("a.__proto__"), []);
		assert.equal(getPathSegments("a.prototype"), []);
		assert.equal(getPathSegments("a.constructor"), []);
	});
