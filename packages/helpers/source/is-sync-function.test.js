import { describe } from "@payvo/sdk-test";

import { isSyncFunction } from "./is-sync-function";

describe("isSyncFunction", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isSyncFunction(new Function()));
	});

	it("should fail", () => {
		assert.false(isSyncFunction(async () => ({})));
		assert.false(isSyncFunction([]));
	});
});
