import { firstMapValue } from "./first-map-value";

describe("#firstMapValue", () => {
	it("should return the first value", () => {
		assert.is(firstMapValue(new Map([["Hello", "World"]])), "World");
	});
});
