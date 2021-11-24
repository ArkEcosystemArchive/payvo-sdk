import { describe } from "@payvo/sdk-test";

import { firstMapKey } from "./first-map-key";

describe("firstMapKey", async ({ assert, it }) => {
	it("should return the first key", () => {
		assert.is(firstMapKey(new Map([["Hello", "World"]])), "Hello");
	});
});
