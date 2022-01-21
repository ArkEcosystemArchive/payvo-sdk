import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WIFService } from "./wif.service.js";
import { WIF } from "@payvo/sdk-cryptography";

describe("WIFService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(WIFService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { wif: identity.wif });
		assert.is(WIF.decode(result.wif).privateKey, identity.privateKey);
	});

	it("should generate an output from a mnemonic given a custom locale", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { wif: identity.wif });
	});

	it("should fail to generate an output from an invalid mnemonic", async (context) => {
		await assert.rejects(() => context.subject.fromMnemonic(undefined));
	});

	it("should generate an output from a private key", async (context) => {
		const result = await context.subject.fromPrivateKey(identity.privateKey);

		assert.equal(result, { wif: identity.wif });
		assert.is(WIF.decode(result.wif).privateKey, identity.privateKey);
	});

	it("should generate an output from a secret", async (context) => {
		await assert.rejects(
			() => context.subject.fromSecret(identity.mnemonic),
			"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
		);

		const result = await context.subject.fromSecret("abc");

		assert.equal(result, { wif: "LvwxxwvWMU7BNF6VBo3vmUbHRZfsjyfrQJtDRTP5UMmtuhLWW4WU" });
	});

	it("should fail to generate an output from an invalid private key", async (context) => {
		await assert.rejects(() => context.subject.fromPrivateKey(undefined));
	});
});
