import { describe } from "@payvo/sdk-test";

import { isBooleanArray } from "./is-boolean-array";

describe("isBooleanArray", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isBooleanArray([true]));
	});

	it("should fail", () => {
		assert.false(isBooleanArray([1]));
	});
});
