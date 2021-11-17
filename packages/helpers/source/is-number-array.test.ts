import { isNumberArray } from "./is-number-array.js";

describe("#isNumberArray", () => {
	it("should pass", () => {
		expect(isNumberArray([1])).toBeTrue();
	});

	it("should fail", () => {
		expect(isNumberArray(["string"])).toBeFalse();
	});
});
