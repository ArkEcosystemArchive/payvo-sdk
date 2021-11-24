import { describe } from "@payvo/sdk-test";

import { isPositiveZero } from "./is-positive-zero";

describe("FeedServisPositiveZeroice", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isPositiveZero(+0));
		assert.true(isPositiveZero(0));
	});

	it("should fail", () => {
		assert.false(isPositiveZero(-0));
		assert.false(isPositiveZero(-1));
	});
});
