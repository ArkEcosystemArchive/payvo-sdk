import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject: PrivateKeyService;

test.before.each(async () => {
	subject = await createService(PrivateKeyService);
});

describe("PrivateKey", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { privateKey: identity.privateKey });
	});

	test("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { privateKey: identity.privateKey });
	});
	test("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.is(subject.fromMnemonic(undefined!)).rejects.toThrow();
	});

	test("should generate an output from a wif", async () => {
		const result = await subject.fromWIF(identity.wif);

		assert.is(result, { privateKey: identity.privateKey });
	});

	test("should fail to generate an output from an invalid wif", async () => {
		await assert.is(subject.fromWIF(undefined!)).rejects.toThrow();
	});

	test("should generate an output from a secret", async () => {
		await assert
			.is(subject.fromSecret(identity.mnemonic))
			.rejects.toEqual(new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."));

		const result = await subject.fromSecret("abc");

		assert.is(result, { privateKey: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad" });
	});

	test("should fail to generate an output from an invalid secret", async () => {
		await assert.is(subject.fromSecret(undefined!)).rejects.toThrow();
	});
});
