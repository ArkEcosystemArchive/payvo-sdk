import { describe } from "@payvo/sdk-test";

import { Argon2 } from "./argon2";

describe("Argon2", ({ assert, it, nock, loader }) => {
	it("should hash the given value", async () => {
		assert.type(await Argon2.hash("password"), "string");
	});

	it("should verify the given value", async () => {
		const hash = await Argon2.hash("password");

		assert.is(await Argon2.verify(hash, "password"), true);
		assert.is(await Argon2.verify(hash, "invalid"), false);
	});
});
