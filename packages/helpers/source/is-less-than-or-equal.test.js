import { describe } from "@payvo/sdk-test";

import { isLessThanOrEqual } from "./is-less-than-or-equal";

describe("isLessThanOrEqual", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isLessThanOrEqual(1, 2));
		assert.true(isLessThanOrEqual(1, 1));
	});

	it("should fail", () => {
		assert.false(isLessThanOrEqual(10, 5));
	});
});
