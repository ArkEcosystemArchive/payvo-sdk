import { test } from "uvu";
import * as assert from 'uvu/assert';

import { PBKDF2 } from "./pbkdf2";

const message = "Hello World";
const password = "password";

test("#encrypt", async () => {
	assert.type(PBKDF2.encrypt(message, password), "string");
});

test("#decrypt", async () => {
	assert.is(PBKDF2.decrypt(PBKDF2.encrypt(message, password), password), message);
});

test.run();
