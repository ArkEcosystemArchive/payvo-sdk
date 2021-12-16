import { describeWithContext } from "@payvo/sdk-test";

import { AES } from "./aes";

describeWithContext(
	"AES",
	{
		message: "Hello World",
		password: "password",
	},
	({ assert, it }) => {
		it("should encrypt the given value", async ({ message, password }) => {
			assert.type(AES.encrypt(message, password), "string");
		});

		it("should decrypt the given value", async ({ message, password }) => {
			assert.is(AES.decrypt(AES.encrypt(message, password), password), message);
		});

		it("should verify the given value", async ({ message, password }) => {
			assert.true(AES.verify(AES.encrypt(message, password), password));
			assert.false(AES.verify(AES.encrypt(message, password), "invalid-password"));
		});
	},
);
