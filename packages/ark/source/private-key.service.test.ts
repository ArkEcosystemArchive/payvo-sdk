import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service.js";

describe("PrivateKeyService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(PrivateKeyService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { privateKey: identity.privateKey });
	});

	it("should generate an output from a mnemonic given a custom locale", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { privateKey: identity.privateKey });
	});

	it("should fail to generate an output from an invalid mnemonic", async (context) => {
		await assert.rejects(() => context.subject.fromMnemonic(undefined));
	});

	it("should generate an output from a wif", async (context) => {
		const result = await context.subject.fromWIF(identity.wif);

		assert.equal(result, { privateKey: identity.privateKey });
	});

	it("should fail to generate an output from an invalid wif", async (context) => {
		await assert.rejects(() => context.subject.fromWIF(undefined));
	});

	it("should generate an output from a secret", async (context) => {
		await assert.rejects(
			() => context.subject.fromSecret(identity.mnemonic),
			"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
		);

		const result = await context.subject.fromSecret("abc");

		assert.equal(result, { privateKey: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" });
	});

	it("should fail to generate an output from an invalid secret", async (context) => {
		await assert.rejects(() => context.subject.fromSecret(undefined));
	});
});
