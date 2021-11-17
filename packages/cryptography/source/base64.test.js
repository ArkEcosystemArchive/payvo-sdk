import { test } from "uvu";
import * as assert from 'uvu/assert';

import { Base64 } from "./base64";

const message = "Hello World";

test("#encode", async () => {
	assert.is(Base64.encode(message), "SGVsbG8gV29ybGQ=");
});

test("#decode", async () => {
	assert.is(Base64.decode(Base64.encode(message)), message);
});

test("#validate", () => {
	assert.is(Base64.validate(Base64.encode("Hello")), true);
	assert.is(Base64.validate("!#$%*#$%*"), false);
});

test.run();
