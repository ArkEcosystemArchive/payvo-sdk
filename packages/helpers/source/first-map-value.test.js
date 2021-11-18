import { firstMapValue } from "./first-map-value";

describe("#firstMapValue", () => {
	test("should return the first value", () => {
		assert.is(firstMapValue(new Map([["Hello", "World"]])), "World");
	});
});
