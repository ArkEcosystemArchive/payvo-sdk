import { isEmptyMap } from "./is-empty-map";

describe("#isEmptyMap", () => {
	it("should return true for an empty map", () => {
		assert.is(isEmptyMap(new Map()), true);
	});
});
