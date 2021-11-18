import { assert, test } from "@payvo/sdk-test";

import { convertBuffer, convertBufferList, convertString, convertStringList } from "./conversion";

test("#convertBuffer", () => {
	assert.is(convertBuffer(Buffer.from("Hello World")), "48656c6c6f20576f726c64");
});

test("#convertBufferList", () => {
	assert.stringArray(convertBufferList([Buffer.from("Hello"), Buffer.from("World")]));
});

test("#convertString", () => {
	assert.buffer(convertString("48656c6c6f20576f726c64"));
});

test("#convertStringList", () => {
	assert.bufferArray(convertStringList(["48656c6c6f", "576f726c64"]));
});

test.run();
