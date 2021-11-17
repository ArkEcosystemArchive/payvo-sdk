import { isEmptySet } from "./is-empty-set.js";

describe("#isEmptySet", () => {
	it("should return true for an empty set", () => {
		expect(isEmptySet(new Set())).toBeTrue();
	});
});
