import { assert, test } from "@payvo/sdk-test";

import { isBuffer } from "./is-buffer";

	test("should pass", () => {
		assert.true(isBuffer(Buffer.alloc(1)));
	});

	test("should fail", () => {
		assert.false(isBuffer(1));
	});
