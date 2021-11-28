import { describe } from "@payvo/sdk-test";

import { convertBuffer, convertBufferList, convertString, convertStringList } from "./conversion";

describe("Conversion", async ({ assert, it, nock, loader }) => {
	it("should convert the given value to a buffer", () => {
		assert.is(convertBuffer(Buffer.from("Hello World")), "48656c6c6f20576f726c64");
	});

	it("should convert the given value to a buffer list", () => {
		assert.stringArray(convertBufferList([Buffer.from("Hello"), Buffer.from("World")]));
	});

	it("should convert the given value to a string", () => {
		assert.buffer(convertString("48656c6c6f20576f726c64"));
	});

	it("should convert the given value to a string list", () => {
		assert.bufferArray(convertStringList(["48656c6c6f", "576f726c64"]));
	});
});
