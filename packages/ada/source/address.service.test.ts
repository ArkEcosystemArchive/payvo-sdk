import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.equal(await context.subject.fromMnemonic(identity.mnemonic), {
			address:
				"addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
			type: "bip44",
		});
	});

	it("should generate an output from a publicKey", async (context) => {
		assert.equal(await context.subject.fromPublicKey(identity.extPublicKey), {
			address:
				"addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
			type: "bip44",
		});
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate(identity.address.slice(0, 10)));
	});
});
