import { isStringArray } from "./is-string-array";

test("#isStringArray", () => {
	test("should pass", () => {
		assert.is(isStringArray(["string"]), true);
	});

	test("should fail", () => {
		assert.is(isStringArray([1]), false);
	});
