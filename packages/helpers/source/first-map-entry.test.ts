import { firstMapEntry } from "./first-map-entry.js";

describe("#firstMapEntry", () => {
	it("should return the first entry", () => {
		assert.is(firstMapEntry(new Map([["Hello", "World"]])), ["Hello", "World"]);
	});
});
