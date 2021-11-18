import { isEmptySet } from "./is-empty-set";

test("#isEmptySet", () => {
	test("should return true for an empty set", () => {
		assert.is(isEmptySet(new Set()), true);
	});
});
