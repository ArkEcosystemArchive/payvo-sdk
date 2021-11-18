import { isEmptyMap } from "./is-empty-map";

	test("should return true for an empty map", () => {
		assert.true(isEmptyMap(new Map()));
	});
