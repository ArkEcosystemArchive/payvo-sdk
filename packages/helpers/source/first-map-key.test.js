import { describe } from "@payvo/sdk-test";

import { firstMapKey } from "./first-map-key";

describe("firstMapKey", async ({ assert, it, nock, loader }) => {
	it("should return the first key", () => {
		assert.is(firstMapKey(new Map([["Hello", "World"]])), "Hello");
	});
});
