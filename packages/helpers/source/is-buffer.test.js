import { isBuffer } from "./is-buffer";

test("#isBuffer", () => {
	test("should pass", () => {
		assert.is(isBuffer(Buffer.alloc(1)), true);
	});

	test("should fail", () => {
		assert.is(isBuffer(1), false);
	});
});
