import { describe } from "@payvo/sdk-test";

import { isNotEqual } from "./is-not-equal";

describe("isNotEqual", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isNotEqual(1, "1"));
	});

	it("should fail", () => {
		assert.false(isNotEqual(1, 1));
	});
});
