import { test } from "uvu";
import * as assert from 'uvu/assert';

import { Argon2 } from "./argon2";

test("#hash", async () => {
	assert.type(await Argon2.hash("password"), "string");
});

test("#verify", async () => {
	const hash = await Argon2.hash("password");

	assert.is(await Argon2.verify(hash, "password"), true);
	assert.is(await Argon2.verify(hash, "invalid"), false);
});

test.run();
