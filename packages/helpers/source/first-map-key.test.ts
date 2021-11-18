import { firstMapKey } from "./first-map-key.js";

describe("#firstMapKey", () => {
	it("should return the first key", () => {
		assert.is(firstMapKey(new Map([["Hello", "World"]])), "Hello");
	});
});
