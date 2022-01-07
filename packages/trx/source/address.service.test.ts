import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService, "trx.mainnet");
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.object(await context.subject.fromMnemonic(identity.mnemonic));
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate("invalid"));
	});
});
