import { describe } from "@payvo/sdk-test";

import { isLessThan } from "./is-less-than";

describe("isLessThan", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isLessThan(5, 10));
	});

	it("should fail", () => {
		assert.false(isLessThan(10, 5));
	});
});
