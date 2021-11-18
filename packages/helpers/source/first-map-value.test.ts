import { firstMapValue } from "./first-map-value.js";

describe("#firstMapValue", () => {
	it("should return the first value", () => {
		assert.is(firstMapValue(new Map([["Hello", "World"]])), "World");
	});
});
