import { describe } from "@payvo/sdk-test";

import { isGreaterThanOrEqual } from "./is-greater-than-or-equal";

describe("isGreaterThanOrEqual", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isGreaterThanOrEqual(2, 1));
		assert.true(isGreaterThanOrEqual(1, 1));
	});

	it("should fail", () => {
		assert.false(isGreaterThanOrEqual(5, 10));
	});
});
