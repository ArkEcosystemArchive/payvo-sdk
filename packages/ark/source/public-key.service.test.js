import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { PublicKeyService } from "./public-key.service";

let subject: PublicKeyService;

test.before.each(async () => {
	subject = await createService(PublicKeyService);
});

describe("PublicKey", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { publicKey: identity.publicKey });
	});

	test("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { publicKey: identity.publicKey });
	});

	test("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.is(subject.fromMnemonic(undefined!)).rejects.toThrow();
	});

	test("should generate an output from a multiSignature", async () => {
		const result = await subject.fromMultiSignature(
			identity.multiSignature.min,
			identity.multiSignature.publicKeys,
		);

		assert.is(result, { publicKey: "0279f05076556da7173610a7676399c3620276ebbf8c67552ad3b1f26ec7627794" });
	});

	test("should fail to generate an output from a multiSignature", async () => {
		await assert.is(subject.fromMultiSignature(-1, [])).rejects.toThrow();
	});

	test("should generate an output from a wif", async () => {
		const result = await subject.fromWIF(identity.wif);

		assert.is(result, { publicKey: identity.publicKey });
	});

	test("should fail to generate an output from a wif", async () => {
		await assert.is(subject.fromWIF(undefined!)).rejects.toThrow();
	});

	test("should generate an output from a secret", async () => {
		await assert
			.is(subject.fromSecret(identity.mnemonic))
			.rejects.toEqual(new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."));

		const result = await subject.fromSecret("abc");

		assert.is(result, { publicKey: "0223542d61708e3fc48ba78fbe8fcc983ba94a520bc33f82b8e45e51dbc47af272" });
	});

	test("should fail to generate an output from a secret", async () => {
		await assert.is(subject.fromSecret(undefined!)).rejects.toThrow();
	});
});
