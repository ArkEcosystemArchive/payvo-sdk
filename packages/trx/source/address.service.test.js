import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

let subject;

describe("AddressService", async ({ beforeEach, it, assert }) => {
	beforeEach(async () => {
		subject = await createService(AddressService);
	});

	it("should generate an output from a mnemonic", async () => {
		assert.object(await subject.fromMnemonic(identity.mnemonic));
	});

	it("should validate an address", async () => {
		assert.true(await subject.validate(identity.address));
		assert.false(await subject.validate("invalid"));
	});
});
