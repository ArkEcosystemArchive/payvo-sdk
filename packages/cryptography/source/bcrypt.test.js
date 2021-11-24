import { describe } from "@payvo/sdk-test";

import { Bcrypt } from "./bcrypt";

describe("Bcrypt", ({ assert, it }) => {
	it("should hash the given value", () => {
		assert.type(Bcrypt.hash("password"), "string");
	});

	it("should verify the given value", () => {
		const hash = Bcrypt.hash("password");

		assert.is(Bcrypt.verify(hash, "password"), true);
		assert.is(Bcrypt.verify(hash, "invalid"), false);
	});
});
