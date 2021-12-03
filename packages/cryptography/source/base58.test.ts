import { describe } from "@payvo/sdk-test";

import { Base58 } from "./base58";

describe("Base58", ({ assert, it, nock, loader }) => {
	it("should encode the given value", () => {
		assert.type(Base58.encode("Hello"), "string");
		assert.type(Base58.encode(Buffer.from("Hello")), "string");
	});

	it("should decode the given value", () => {
		assert.is(Base58.decode(Base58.encode("Hello")).toString(), "Hello");
	});

	it("should validate the given value", () => {
		assert.is(Base58.validate(Base58.encode("Hello")), true);
		assert.is(Base58.validate("SGVsbG8sIFdvcmxk"), false);
	});
});
