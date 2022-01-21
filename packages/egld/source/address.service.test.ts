import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ beforeEach, assert, it, nock, loader }) => {
	beforeEach(async (context) => {
		// @ts-ignore
		context.subject = new AddressService({
			get() {
				return undefined;
			},
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should fail to generate an output from a privateKey", async (context) => {
		const result = await context.subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate(identity.address.slice(0, 10)));
	});
});
