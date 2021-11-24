import { describe } from "@payvo/sdk-test";

import { isPositive } from "./is-positive";

describe("isPositive", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isPositive(1));
	});

	it("should fail", () => {
		assert.false(isPositive(-1));
	});
});
