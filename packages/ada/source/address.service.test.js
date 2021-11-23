import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

let subject;

describe("AddressService", async ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(AddressService);
	});

	it("should generate an output from a mnemonic", async () => {
		assert.equal(await subject.fromMnemonic(identity.mnemonic), {
			address:
				"addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
			type: "bip44",
		});
	});

	it("should generate an output from a publicKey", async () => {
		assert.equal(await subject.fromPublicKey(identity.extPublicKey), {
			address:
				"addr_test1qqy6nhfyks7wdu3dudslys37v252w2nwhv0fw2nfawemmn8k8ttq8f3gag0h89aepvx3xf69g0l9pf80tqv7cve0l33sw96paj",
			type: "bip44",
		});
	});

	it("should validate an address", async () => {
		assert.true(await subject.validate(identity.address));
		assert.false(await subject.validate(identity.address.slice(0, 10)));
	});
});
