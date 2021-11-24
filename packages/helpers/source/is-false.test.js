import { describe } from "@payvo/sdk-test";

import { isFalse } from "./is-false";

describe("isFalse", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isFalse(false));
	});

	it("should fail", () => {
		assert.false(isFalse(true));
	});
});
