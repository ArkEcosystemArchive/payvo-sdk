import { isEmptyMap } from "./is-empty-map";

test("#isEmptyMap", () => {
	test("should return true for an empty map", () => {
		assert.is(isEmptyMap(new Map()), true);
	});
});
