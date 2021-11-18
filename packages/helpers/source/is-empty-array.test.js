import { isEmptyArray } from "./is-empty-array";

	test("should return true for an empty array", () => {
		assert.true(isEmptyArray([]));
	});
