import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WIFService } from "./wif.service";

let subject;

describe("AddressService", async ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(WIFService);
	});

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { wif: identity.wif });
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { wif: identity.wif });
	});
	it("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.rejects(() => subject.fromMnemonic(undefined));
	});

	it("should generate an output from a private key", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, { wif: identity.wif });
	});

	it("should fail to generate an output from an invalid private key", async () => {
		await assert.rejects(() => subject.fromPrivateKey(undefined));
	});

	it("should generate an output from a secret", async () => {
		await assert.rejects(
			() => subject.fromSecret(identity.mnemonic),
			"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
		);

		const result = await subject.fromSecret("abc");

		assert.equal(result, { wif: "SFpfYkttf168Ssa96XG5RjzpPCuMo3S2GDJuZorV9auX3cTQJdqW" });
	});

	it("should fail to generate an output from an invalid secret", async () => {
		await assert.rejects(() => subject.fromSecret(undefined));
	});
});
