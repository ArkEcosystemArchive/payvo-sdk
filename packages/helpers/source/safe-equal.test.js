import { safeEqual } from "./safe-equal";

test("#safeEqual", () => {
	test("should determine if values are equal in a safe manner", () => {
		assert.is(safeEqual(new Uint8Array(1), new Uint8Array(1)), true);
		assert.is(safeEqual(new Uint8Array(1), new Uint8Array(2)), false);

		assert.is(safeEqual(new Uint16Array(1), new Uint16Array(1)), true);
		assert.is(safeEqual(new Uint16Array(1), new Uint16Array(2)), false);

		assert.is(safeEqual(new Uint32Array(1), new Uint32Array(1)), true);
		assert.is(safeEqual(new Uint32Array(1), new Uint32Array(2)), false);

		assert.is(safeEqual(Buffer.alloc(1), Buffer.alloc(1)), true);
		assert.is(safeEqual(Buffer.alloc(1), Buffer.alloc(2)), false);
	});
});
