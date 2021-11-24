import { describe } from "@payvo/sdk-test";

import { isNegative } from "./is-negative";

describe("isNegative", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isNegative(-1));
	});

	it("should fail", () => {
		assert.false(isNegative(1));
	});
});
