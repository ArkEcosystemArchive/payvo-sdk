import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject;

describe("AddressService", async ({ beforeEach, assert, it }) => {
	beforeEach(async () => (subject = new AddressService()));

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should fail to generate an output from a privateKey", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should validate an address", async () => {
		assert.true(await subject.validate(identity.address));
		assert.false(await subject.validate(identity.address.slice(0, 10)));
	});
});
