import { hex } from "./hex.js";

describe("#hex", () => {
	it("should encode the given string", () => {
		assert.is(hex.encode("Hello World"), "48656c6c6f20576f726c64");
	});

	it("should decode the given string", () => {
		assert.is(hex.decode("48656c6c6f20576f726c64"), "Hello World");
	});
});
