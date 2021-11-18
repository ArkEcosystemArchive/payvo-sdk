import { assert, test } from "@payvo/sdk-test";

import { Base58 } from "./base58";

test("#encode", () => {
	assert.type(Base58.encode("Hello"), "string");
	assert.type(Base58.encode(Buffer.from("Hello")), "string");
});

test("#decode", () => {
	assert.is(Base58.decode(Base58.encode("Hello")), "Hello");
});

test("#validate", () => {
	assert.is(Base58.validate(Base58.encode("Hello")), true);
	assert.is(Base58.validate("SGVsbG8sIFdvcmxk"), false);
});

test.run();
