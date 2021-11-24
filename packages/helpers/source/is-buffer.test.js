import { describe } from "@payvo/sdk-test";

import { isBuffer } from "./is-buffer";

describe("isBuffer", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isBuffer(Buffer.alloc(1)));
	});

	it("should fail", () => {
		assert.false(isBuffer(1));
	});
});
