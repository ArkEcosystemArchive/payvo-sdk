import { describe } from "@payvo/sdk-test";

import { abort_if, abort_unless } from "./abort";

describe("Abort", async ({ assert, it, nock, loader }) => {
	it("should abort if the condition is met", () => {
		assert.not.throws(() => abort_if(false, "Hello"));
		assert.throws(() => abort_if(true, "Hello"));
	});

	it("should not abort unless the condition is met ", () => {
		assert.not.throws(() => abort_unless(true, "Hello"));
		assert.throws(() => abort_unless(false, "Hello"));
	});
});
