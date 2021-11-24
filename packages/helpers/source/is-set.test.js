import { describe } from "@payvo/sdk-test";

import { isSet } from "./is-set";

describe("isSet", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isSet(new Set()));
	});

	it("should fail", () => {
		assert.false(isSet(1));
	});
});
