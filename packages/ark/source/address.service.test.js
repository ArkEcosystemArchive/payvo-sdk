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
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a multiSignature", async () => {
		const result = await subject.fromMultiSignature({
			min: identity.multiSignature.min,
			publicKeys: identity.multiSignature.publicKeys,
		});

		assert.equal(result, { type: "bip39", address: "DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi" });
	});

	it("should generate an output from a publicKey", async () => {
		const result = await subject.fromPublicKey(identity.publicKey);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a privateKey", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a secret", async () => {
		await assert.rejects(
			() => subject.fromSecret(identity.mnemonic),
			"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
		);

		const result = await subject.fromSecret("abc");

		assert.equal(result, { type: "bip39", address: "DNTwQTSp999ezQ425utBsWetcmzDuCn2pN" });
	});

	it("should generate an output from a wif", async () => {
		const result = await subject.fromWIF(identity.wif);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should validate an address", async () => {
		assert.true(await subject.validate(identity.address));
		assert.false(await subject.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX"));
		assert.false(await subject.validate("ABC"));
		assert.false(await subject.validate(""));
		assert.false(await subject.validate(undefined));
		assert.false(await subject.validate(null));
		assert.false(await subject.validate({}));
	});

	for (const method of [
		"fromMnemonic",
		"fromMultiSignature",
		"fromPublicKey",
		"fromPrivateKey",
		"fromSecret",
		"fromWIF",
	]) {
		it(`should fail to generate an output from an invalid input when using ${method}()`, async () => {
			await assert.rejects(() => subject[method](undefined));
		});
	}
});
