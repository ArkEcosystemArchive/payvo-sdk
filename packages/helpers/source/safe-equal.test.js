import { assert, test } from "@payvo/sdk-test";

import { safeEqual } from "./safe-equal";

	test("should determine if values are equal in a safe manner", () => {
		assert.true(safeEqual(new Uint8Array(1), new Uint8Array(1)));
		assert.false(safeEqual(new Uint8Array(1), new Uint8Array(2)));

		assert.true(safeEqual(new Uint16Array(1), new Uint16Array(1)));
		assert.false(safeEqual(new Uint16Array(1), new Uint16Array(2)));

		assert.true(safeEqual(new Uint32Array(1), new Uint32Array(1)));
		assert.false(safeEqual(new Uint32Array(1), new Uint32Array(2)));

		assert.true(safeEqual(Buffer.alloc(1), Buffer.alloc(1)));
		assert.false(safeEqual(Buffer.alloc(1), Buffer.alloc(2)));
	});
