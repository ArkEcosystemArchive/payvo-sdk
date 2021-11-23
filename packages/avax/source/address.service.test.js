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
			address: "X-fuji1rusf9c2uwlqxg5crfrqr8xrt4r49yk6rskehvm",
			path: "m/44'/9000'/0'/0/0",
			type: "bip44",
		});
	});

	it("should fail to generate an output from a privateKey", async () => {
		assert.equal(await subject.fromPrivateKey(identity.privateKey), {
			type: "bip44",
			address: identity.address,
		});
	});

	it("should fail to validate an address", async () => {
		assert.true(await subject.validate(identity.address));
	});
});
