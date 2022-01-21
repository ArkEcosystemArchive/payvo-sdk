import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ beforeEach, assert, it }) => {
	beforeEach(async (context) => {
		// @ts-ignore
		context.subject = new AddressService({
			get() {
				return undefined;
			},
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, {
			address: "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
			path: "m/44'/148'/0'",
			type: "bip44",
		});
	});

	it("should generate an output from a private key", async (context) => {
		const result = await context.subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, {
			address: "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
			path: "m/44'/148'/0'",
			type: "bip44",
		});
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate("invalid"));
	});
});
