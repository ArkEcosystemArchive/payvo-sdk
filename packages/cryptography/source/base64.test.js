import { describe } from "@payvo/sdk-test";

import { Base64 } from "./base64";

describe("Base64", ({ assert, it, nock, loader }) => {
	it("should encode the given value", async () => {
		const message = "Hello World";
		assert.is(Base64.encode(message), "SGVsbG8gV29ybGQ=");
	});

	it("should decode the given value", async () => {
		const message = "Hello World";
		assert.is(Base64.decode(Base64.encode(message)), message);
	});

	it("should validate the given value", () => {
		assert.is(Base64.validate(Base64.encode("Hello")), true);
		assert.is(Base64.validate("!#$%*#$%*"), false);
	});
});
