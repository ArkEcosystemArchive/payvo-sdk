import { describe } from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a mnemonic given a custom locale", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a multiSignature", async (context) => {
		const result = await context.subject.fromMultiSignature({
			min: identity.multiSignature.min,
			publicKeys: identity.multiSignature.publicKeys,
		});

		assert.equal(result, { type: "bip39", address: "DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi" });
	});

	it("should generate an output from a publicKey", async (context) => {
		const result = await context.subject.fromPublicKey(identity.publicKey);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a privateKey", async (context) => {
		const result = await context.subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a secret", async (context) => {
		await assert.rejects(
			() => context.subject.fromSecret(identity.mnemonic),
			"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
		);

		const result = await context.subject.fromSecret("abc");

		assert.equal(result, { type: "bip39", address: "DNTwQTSp999ezQ425utBsWetcmzDuCn2pN" });
	});

	it("should generate an output from a wif", async (context) => {
		const result = await context.subject.fromWIF(identity.wif);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"));
		assert.false(await context.subject.validate("ABC"));
		assert.false(await context.subject.validate(""));
		assert.false(await context.subject.validate(undefined));
		assert.false(await context.subject.validate(null));
		assert.false(await context.subject.validate({}));
	});

	for (const method of [
		"fromMnemonic",
		"fromMultiSignature",
		"fromPublicKey",
		"fromPrivateKey",
		"fromSecret",
		"fromWIF",
	]) {
		it(`should fail to generate an output from an invalid input when using ${method}()`, async (context) => {
			await assert.rejects(() => context.subject[method](undefined));
		});
	}
});
