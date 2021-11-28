import { describe } from "@payvo/sdk-test";

import { isFunction } from "./is-function";

describe("isFunction", async ({ assert, it, nock, loader }) => {
	it("should pass", () => {
		assert.true(isFunction(new Function()));
		assert.true(isFunction(async () => ({})));
	});

	it("should fail", () => {
		assert.false(isFunction([]));
	});
});
