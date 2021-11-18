import { assert, describe, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => (subject = new AddressService()));

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, {
		address: "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
		path: "m/44'/148'/0'",
		type: "bip44",
	});
});

test("should generate an output from a private key", async () => {
	const result = await subject.fromPrivateKey(identity.privateKey);

	assert.equal(result, {
		address: "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
		path: "m/44'/148'/0'",
		type: "bip44",
	});
});

test("should validate an address", async () => {
	assert.true(await subject.validate(identity.address));
	assert.false(await subject.validate("invalid"));
});

test.run();
