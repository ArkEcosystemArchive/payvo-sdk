import { isStringArray } from "./is-string-array";

	test("should pass", () => {
		assert.true(isStringArray(["string"]));
	});

	test("should fail", () => {
		assert.false(isStringArray([1]));
	});
