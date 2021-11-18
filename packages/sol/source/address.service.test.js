import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => {
    subject = await createService(AddressService);
});

test("should generate an output from a mnemonic", async () => {
	assert.equal(await subject.fromMnemonic(identity.mnemonic), {
		type: "bip44",
		address: identity.address,
	});
});

test("should fail to generate an output from a privateKey", async () => {
	assert.equal(await subject.fromPrivateKey(identity.privateKey), {
		type: "bip44",
		address: identity.address,
	});
});

test("should generate an output from a publicKey", async () => {
	assert.equal(await subject.fromPublicKey(identity.publicKey), {
		type: "bip44",
		address: identity.address,
	});
});

test("should validate an address", async () => {
	assert.true(await subject.validate(identity.address));
});

test.run();
