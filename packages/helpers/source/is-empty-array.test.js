import { describe } from "@payvo/sdk-test";

import { isEmptyArray } from "./is-empty-array";

describe("isEmptyArray", async ({ assert, it }) => {
	it("should return true for an empty array", () => {
		assert.true(isEmptyArray([]));
	});
});
