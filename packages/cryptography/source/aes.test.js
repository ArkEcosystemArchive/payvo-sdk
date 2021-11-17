import { test } from "uvu";
import * as assert from 'uvu/assert';

import { AES } from "./aes";

const message = "Hello World";
const password = "password";
const salt = "salt";
const iv = "secretsecretsecretsecret";

test("#encrypt", async () => {
	assert.is(AES.encrypt(message, password, salt, iv), "Y8RT6kFrfwll6SXUOti6UQ==");
});

test("#decrypt", async () => {
	assert.is(AES.decrypt("Y8RT6kFrfwll6SXUOti6UQ==", password, salt, iv), message);
});

test.run();
