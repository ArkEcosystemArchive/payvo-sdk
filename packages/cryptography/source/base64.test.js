import { describe } from "@payvo/sdk-test";

import { Base64 } from "./base64";

const message = "Hello World";

describe("Base64", ({ assert, it }) => {
	it("should encode the given value", async () => {
		assert.is(Base64.encode(message), "SGVsbG8gV29ybGQ=");
	});

	it("should decode the given value", async () => {
		assert.is(Base64.decode(Base64.encode(message)), message);
	});

	it("should validate the given value", () => {
		assert.is(Base64.validate(Base64.encode("Hello")), true);
		assert.is(Base64.validate("!#$%*#$%*"), false);
	});
});
