import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, {
			address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
			type: "bip44",
		});
	});

	it("should generate an output from a publicKey", async (context) => {
		const result = await context.subject.fromPublicKey(identity.publicKey);

		assert.equal(result, {
			address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
			type: "bip44",
		});
	});

	it("should generate an output from a privateKey", async (context) => {
		const result = await context.subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, {
			address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
			type: "bip44",
		});
	});

	it("should generate an output from a wif", async (context) => {
		const result = await context.subject.fromWIF(identity.wif);

		assert.equal(result, {
			address: "APPJtAkysCKBssD5EJzEpakntNk81nR7X2",
			type: "bip44",
		});
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"));
		assert.false(await context.subject.validate("ABC"));
	});
});
