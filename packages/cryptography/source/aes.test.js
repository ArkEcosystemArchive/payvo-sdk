import { describe } from "@payvo/sdk-test";

import { AES } from "./aes";

const message = "Hello World";
const password = "password";
const salt = "salt";
const iv = "secretsecretsecretsecret";

describe("AES", ({ assert, it }) => {
	it("should encrypt the given value", () => {
		assert.is(AES.encrypt(message, password, salt, iv), "Y8RT6kFrfwll6SXUOti6UQ==");
	});

	it("should decrypt the given value", () => {
		assert.is(AES.decrypt("Y8RT6kFrfwll6SXUOti6UQ==", password, salt, iv), message);
	});
});
