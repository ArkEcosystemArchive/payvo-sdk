import { describeWithContext } from "@payvo/sdk-test";

import { AES } from "./aes";

describeWithContext(
	"AES",
	{
		message: "Hello World",
		password: "password",
		salt: "salt",
		iv: "secretsecretsecretsecret",
	},
	({ assert, it, nock, loader }) => {
		it("should encrypt the given value", (context) => {
			assert.is(
				AES.encrypt(context.message, context.password, context.salt, context.iv),
				"Y8RT6kFrfwll6SXUOti6UQ==",
			);
		});

		it("should decrypt the given value", (context) => {
			assert.is(
				AES.decrypt("Y8RT6kFrfwll6SXUOti6UQ==", context.password, context.salt, context.iv),
				context.message,
			);
		});
	},
);
