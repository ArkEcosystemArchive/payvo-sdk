import { assert, test } from "@payvo/sdk-test";

import { firstMapEntry } from "./first-map-entry";

test("should return the first entry", () => {
	assert.equal(firstMapEntry(new Map([["Hello", "World"]])), ["Hello", "World"]);
});

test.run();
