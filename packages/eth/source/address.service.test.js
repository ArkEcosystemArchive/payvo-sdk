import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

describe("AddressService", ({ it, assert, beforeEach }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService);
	});

	it("should generate an output from a mnemonic", async ({ subject }) => {
		assert.equal(await subject.fromMnemonic(identity.mnemonic), {
			address: "0x986a007a43D65ff18D040AcdAd844cfE7c349135",
			type: "bip44",
		});
	});

	it("should generate an output from a privateKey", async ({ subject }) => {
		assert.equal(await subject.fromPrivateKey(identity.privateKey), {
			address: "0x986a007a43D65ff18D040AcdAd844cfE7c349135",
			type: "bip44",
		});
	});

	it("should validate an address", async ({ subject }) => {
		assert.true(await subject.validate("0x986A007A43D65FF18D040ACDAD844CFE7C349135"));
		assert.false(await subject.validate("randomString"));
	});
});
