import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => (subject = new AddressService()));

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { type: "bip39", address: identity.address });
});

test("should fail to generate an output from a privateKey", async () => {
	const result = await subject.fromPrivateKey(identity.privateKey);

	assert.equal(result, { type: "bip39", address: identity.address });
});

test("should validate an address", async () => {
	assert.true(await subject.validate(identity.address));
	assert.false(await subject.validate(identity.address.slice(0, 10)));
});

test.run();
