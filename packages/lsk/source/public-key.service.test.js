import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PublicKeyService } from "./public-key.service";

let subject;

test.before.each(async () => {
	subject = await createService(PublicKeyService);
});

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { publicKey: identity.publicKey });
});

test("should generate an output from a mnemonic given a custom locale", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { publicKey: identity.publicKey });
});

test("should generate an output from a secret", async () => {
	await assert.rejects(
		() => subject.fromSecret(identity.mnemonic),
		"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
	);

	assert.equal(await subject.fromSecret("secret"), {
		publicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
	});
});

test.run();
