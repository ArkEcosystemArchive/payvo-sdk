import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject;

describe("AddressService", async ({ beforeEach, assert, it }) => {
	beforeEach(async () => (subject = new AddressService()));

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, {
			address: "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
			path: "m/44'/148'/0'",
			type: "bip44",
		});
	});

	it("should generate an output from a private key", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, {
			address: "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
			path: "m/44'/148'/0'",
			type: "bip44",
		});
	});

	it("should validate an address", async () => {
		assert.true(await subject.validate(identity.address));
		assert.false(await subject.validate("invalid"));
	});
});
