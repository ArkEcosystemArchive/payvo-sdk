import { describe } from "@payvo/sdk-test";

import { isArrayOfType } from "./is-array-of-type";

describe("isArrayOfType", async ({ assert, it, nock, loader }) => {
	it("should pass", () => {
		assert.true(isArrayOfType([1], "number"));
	});

	it("should fail", () => {
		assert.false(isArrayOfType(["string"], "number"));
	});
});
