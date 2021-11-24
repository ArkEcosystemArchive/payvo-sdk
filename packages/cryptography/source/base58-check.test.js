import { describe } from "@payvo/sdk-test";

import { Base58Check } from "./base58-check";

describe("Base58Check", ({ assert, it }) => {
	it("should encode the given value", () => {
		assert.type(Base58Check.encode("Hello"), "string");
		assert.type(Base58Check.encode(Buffer.from("Hello")), "string");
	});

	it("should decode the given value", () => {
		assert.is(Base58Check.decode(Base58Check.encode("Hello")).toString("utf8"), "Hello");
	});
});
