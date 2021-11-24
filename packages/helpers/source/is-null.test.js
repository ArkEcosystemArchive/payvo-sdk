import { describe } from "@payvo/sdk-test";

import { isNull } from "./is-null";

describe("isNull", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isNull(null));
	});

	it("should fail", () => {
		assert.false(isNull("null"));
	});
});
