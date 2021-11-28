import { describe } from "@payvo/sdk-test";

import { UUID } from "./uuid";

describe("UUID", ({ assert, it, nock, loader }) => {
	it("should create a UUID based on the TIMESTAMP method", () => {
		assert.string(UUID.timestamp());
	});

	it("should create a UUID based on the MD5 method", () => {
		assert.is(
			UUID.md5("Hello World", "1b671a64-40d5-491e-99b0-da01ff1f3341"),
			"d954df73-1ea5-303b-a2cc-b24265839eec",
		);
	});

	it("should create a UUID based on the RANDOM method", () => {
		assert.string(UUID.random());
	});

	it("should create a UUID based on the SHA1 method", () => {
		assert.is(
			UUID.sha1("Hello World", "1b671a64-40d5-491e-99b0-da01ff1f3341"),
			"a572fa0f-9bfa-5103-9882-16394770ad11",
		);
	});

	it("should parse the given value", () => {
		const dummy = "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b";
		assert.object(UUID.parse(dummy));
	});

	it("should stringify the given value", () => {
		const dummy = "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b";
		assert.is(UUID.stringify(UUID.parse(dummy)), "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b");
	});

	it("should validate the given value", () => {
		const dummy = "6ec0bd7f-11c0-43da-975e-2a8ad9ebae0b";
		assert.true(UUID.validate(dummy));
		assert.false(UUID.validate("invalid"));
	});
});
