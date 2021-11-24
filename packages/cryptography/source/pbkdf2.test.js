import { describe } from "@payvo/sdk-test";

import { PBKDF2 } from "./pbkdf2";

const message = "Hello World";
const password = "password";

describe("PBKDF2", ({ assert, it }) => {
	it("should encrypt the given value", async () => {
		assert.type(PBKDF2.encrypt(message, password), "string");
	});

	it("should decrypt the given value", async () => {
		assert.is(PBKDF2.decrypt(PBKDF2.encrypt(message, password), password), message);
	});
});
