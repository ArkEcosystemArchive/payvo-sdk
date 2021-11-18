import { assert, test } from "@payvo/sdk-test";

import { base64 } from "./base64";

test("#base64", () => {
	test("should encode the given string", () => {
		assert.is(base64.encode("Hello World"), "SGVsbG8gV29ybGQ=");
	});

	test("should decode the given string", () => {
		assert.is(base64.decode("SGVsbG8gV29ybGQ="), "Hello World");
	});
});
