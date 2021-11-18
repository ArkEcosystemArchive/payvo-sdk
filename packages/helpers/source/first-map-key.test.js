import { firstMapKey } from "./first-map-key";

describe("#firstMapKey", () => {
	test("should return the first key", () => {
		assert.is(firstMapKey(new Map([["Hello", "World"]])), "Hello");
	});
});
