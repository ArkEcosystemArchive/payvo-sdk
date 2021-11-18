import { firstMapEntry } from "./first-map-entry";

describe("#firstMapEntry", () => {
	test("should return the first entry", () => {
		assert.is(firstMapEntry(new Map([["Hello", "World"]])), ["Hello", "World"]);
	});
});
