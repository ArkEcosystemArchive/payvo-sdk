import { describe } from "@payvo/sdk-test";

import { isNumberArray } from "./is-number-array";

describe("isNumberArray", async ({ assert, it, nock, loader }) => {
	it("should pass", () => {
		assert.true(isNumberArray([1]));
	});

	it("should fail", () => {
		assert.false(isNumberArray(["string"]));
	});
});
