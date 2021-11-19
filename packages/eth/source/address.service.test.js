import { assert, describe, loader, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => {
	subject = await createService(AddressService);
});

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, {
		address: "0x986a007a43D65ff18D040AcdAd844cfE7c349135",
		type: "bip44",
	});
});

test("should generate an output from a privateKey", async () => {
	const result = await subject.fromPrivateKey(identity.privateKey);

	assert.equal(result, {
		address: "0x986a007a43D65ff18D040AcdAd844cfE7c349135",
		type: "bip44",
	});
});

test("should validate an address", async () => {
	assert.true(await subject.validate("0x986A007A43D65FF18D040ACDAD844CFE7C349135"));
	assert.false(await subject.validate("randomString"));
});

test.run();
