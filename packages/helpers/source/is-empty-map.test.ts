import { isEmptyMap } from "./is-empty-map.js";

describe("#isEmptyMap", () => {
	it("should return true for an empty map", () => {
		assert.is(isEmptyMap(new Map()), true);
	});
});
