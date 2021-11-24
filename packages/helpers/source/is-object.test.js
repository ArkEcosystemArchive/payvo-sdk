import { describe } from "@payvo/sdk-test";

import { isObject } from "./is-object";

describe("isObject", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isObject({ key: "value" }));
	});

	it("should fail", () => {
		assert.false(isObject(1));
	});
});
