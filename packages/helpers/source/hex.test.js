import { assert, test } from "@payvo/sdk-test";

import { hex } from "./hex";

test("should encode the given string", () => {
	assert.is(hex.encode("Hello World"), "48656c6c6f20576f726c64");
});

test("should decode the given string", () => {
	assert.is(hex.decode("48656c6c6f20576f726c64"), "Hello World");
});

test.run();