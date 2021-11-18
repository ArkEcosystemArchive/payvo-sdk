import { isEmptyArray } from "./is-empty-array";

test("#isEmptyArray", () => {
	test("should return true for an empty array", () => {
		assert.is(isEmptyArray([]), true);
	});
});
