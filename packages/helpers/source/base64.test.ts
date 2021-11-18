import { base64 } from "./base64.js";

describe("#base64", () => {
	it("should encode the given string", () => {
		assert.is(base64.encode("Hello World"), "SGVsbG8gV29ybGQ=");
	});

	it("should decode the given string", () => {
		assert.is(base64.decode("SGVsbG8gV29ybGQ="), "Hello World");
	});
});
