import { describe } from "@payvo/sdk-test";

import { UUID } from "./uuid";

describe("UUID", ({ assert, it }) => {
	it("should create a UUID based on the RANDOM method", () => {
		assert.string(UUID.random());
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
