import { isEmptyArray } from "./is-empty-array.js";

describe("#isEmptyArray", () => {
	it("should return true for an empty array", () => {
		expect(isEmptyArray([])).toBeTrue();
	});
});
