import { isEmptyArray } from "./is-empty-array";

describe("#isEmptyArray", () => {
	it("should return true for an empty array", () => {
		assert.is(isEmptyArray([]), true);
	});
});
