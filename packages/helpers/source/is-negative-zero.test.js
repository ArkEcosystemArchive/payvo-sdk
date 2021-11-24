import { describe } from "@payvo/sdk-test";

import { isNegativeZero } from "./is-negative-zero";

describe("isNegativeZero", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isNegativeZero(-0));
	});

	it("should fail", () => {
		assert.false(isNegativeZero(+0));
		assert.false(isNegativeZero(0));
		assert.false(isNegativeZero(-1));
	});
});
