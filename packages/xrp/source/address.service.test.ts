import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ beforeEach, assert, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService);
	});

	it("should generate an output from a publicKey", async (context) => {
		const result = await context.subject.fromPublicKey(identity.publicKey);

		assert.equal(result, { type: "rfc6979", address: identity.address });
	});

	it("should generate an output from a secret", async (context) => {
		const result = await context.subject.fromSecret(identity.mnemonic);

		assert.equal(result, { type: "rfc6979", address: identity.address });
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate("invalid"));
	});
});
