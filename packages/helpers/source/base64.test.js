import { describe } from "@payvo/sdk-test";

import { base64 } from "./base64";

describe("base64", async ({ assert, it, nock, loader }) => {
	it("should encode the given string", () => {
		assert.is(base64.encode("Hello World"), "SGVsbG8gV29ybGQ=");
	});

	it("should decode the given string", () => {
		assert.is(base64.decode("SGVsbG8gV29ybGQ="), "Hello World");
	});
});
