import "jest-extended";

import { isBooleanArray } from "./is-boolean-array.js";

describe("#isBooleanArray", () => {
	it("should pass", () => {
		expect(isBooleanArray([true])).toBeTrue();
	});

	it("should fail", () => {
		expect(isBooleanArray([1])).toBeFalse();
	});
});
