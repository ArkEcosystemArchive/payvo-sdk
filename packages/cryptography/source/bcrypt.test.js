import { test } from "uvu";
import * as assert from "uvu/assert";

import { Bcrypt } from "./bcrypt";

test("#hash", () => {
	assert.type(Bcrypt.hash("password"), "string");
});

test("#verify", () => {
	const hash = Bcrypt.hash("password");

	assert.is(Bcrypt.verify(hash, "password"), true);
	assert.is(Bcrypt.verify(hash, "invalid"), false);
});

test.run();
