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

	test("should generate an output from a secret", async () => {
		await assert
			.is(subject.fromSecret(identity.mnemonic))
			.rejects.toEqual(new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."));

		await assert.is(subject.fromSecret("secret")).resolves.toEqual({
			publicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
		});
	});
});
