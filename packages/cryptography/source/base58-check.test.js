import { assert, test } from "@payvo/sdk-test";

import { Base58Check } from "./base58-check";

test("#encode", () => {
	assert.type(Base58Check.encode("Hello"), "string");
	assert.type(Base58Check.encode(Buffer.from("Hello")), "string");
});

test("#decode", () => {
	assert.is(Base58Check.decode(Base58Check.encode("Hello")).toString("utf8"), "Hello");
});

test.run();
