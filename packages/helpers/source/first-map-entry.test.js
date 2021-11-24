import { describe } from "@payvo/sdk-test";

import { firstMapEntry } from "./first-map-entry";

describe("firstMapEntry", async ({ assert, it }) => {
	it("should return the first entry", () => {
		assert.equal(firstMapEntry(new Map([["Hello", "World"]])), ["Hello", "World"]);
	});
});
