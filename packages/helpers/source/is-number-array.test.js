import { isNumberArray } from "./is-number-array";

test("#isNumberArray", () => {
	test("should pass", () => {
		assert.is(isNumberArray([1]), true);
	});

	test("should fail", () => {
		assert.is(isNumberArray(["string"]), false);
	});
