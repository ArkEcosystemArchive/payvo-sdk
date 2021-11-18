import { assert, test } from "@payvo/sdk-test";

import { firstMapEntry } from "./first-map-entry";

test("should return the first entry", () => {
	assert.is(firstMapEntry(new Map([["Hello", "World"]])), ["Hello", "World"]);
});
