import { describe } from "@payvo/sdk-test";

import { isEmptySet } from "./is-empty-set";

describe("isEmptySet", async ({ assert, it, nock, loader }) => {
	it("should return true for an empty set", () => {
		assert.true(isEmptySet(new Set()));
	});
});
