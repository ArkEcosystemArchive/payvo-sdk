import { assert, test } from "@payvo/sdk-test";

import { firstMapKey } from "./first-map-key";

test("should return the first key", () => {
	assert.is(firstMapKey(new Map([["Hello", "World"]])), "Hello");
});

test.run();
