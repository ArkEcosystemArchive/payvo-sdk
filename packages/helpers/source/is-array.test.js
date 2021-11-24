import { describe } from "@payvo/sdk-test";

import { isArray } from "./is-array";

describe("isArray", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isArray([1]));
	});

	it("should fail", () => {
		assert.false(isArray(1));
	});
});
