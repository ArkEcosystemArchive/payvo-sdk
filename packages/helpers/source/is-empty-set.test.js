import { isEmptySet } from "./is-empty-set";

describe("#isEmptySet", () => {
	it("should return true for an empty set", () => {
		assert.is(isEmptySet(new Set()), true);
	});
});
