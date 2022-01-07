import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";

describe("AddressService", ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.equal(await context.subject.fromMnemonic(identity.mnemonic), {
			type: "bip44",
			address: identity.address,
		});
	});

	it("should fail to generate an output from a privateKey", async (context) => {
		assert.equal(await context.subject.fromPrivateKey(identity.privateKey), {
			type: "bip44",
			address: identity.address,
		});
	});

	it("should generate an output from a publicKey", async (context) => {
		assert.equal(await context.subject.fromPublicKey(identity.publicKey), {
			type: "bip44",
			address: identity.address,
		});
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
	});
});
