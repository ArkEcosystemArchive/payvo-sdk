import { describe } from "@payvo/sdk-test";

import { firstMapValue } from "./first-map-value";

describe("firstMapValue", async ({ assert, it }) => {
	it("should return the first value", () => {
		assert.is(firstMapValue(new Map([["Hello", "World"]])), "World");
	});
});
