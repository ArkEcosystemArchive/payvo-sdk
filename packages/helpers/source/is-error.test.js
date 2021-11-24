import { describe } from "@payvo/sdk-test";

import { isError } from "./is-error";

describe("isError", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isError(new Error()));
	});

	it("should fail", () => {
		assert.false(isError(1));
	});
});
