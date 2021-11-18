import { isBuffer } from "./is-buffer.js";

describe("#isBuffer", () => {
	it("should pass", () => {
		assert.is(isBuffer(Buffer.alloc(1)), true);
	});

	it("should fail", () => {
		assert.is(isBuffer(1), false);
	});
});
