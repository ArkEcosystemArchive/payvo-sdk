import { describe } from "@payvo/sdk-test";

import { isEmptyObject } from "./is-empty-object";

describe("isEmptyObject", async ({ assert, it }) => {
	it("should return true for an empty object", () => {
		assert.true(isEmptyObject({}));
	});
});
