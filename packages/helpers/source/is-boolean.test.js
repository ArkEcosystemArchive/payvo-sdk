import { describe } from "@payvo/sdk-test";

import { isBoolean } from "./is-boolean";

describe("isBoolean", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isBoolean(true));
	});

	it("should fail", () => {
		assert.false(isBoolean("false"));
	});
});
