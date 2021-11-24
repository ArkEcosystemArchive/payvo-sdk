import { describe } from "@payvo/sdk-test";

import { isString } from "./is-string";

describe("isString", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isString("string"));
	});

	it("should fail", () => {
		assert.false(isString(1));
	});
});
