import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject;

test.before.each(async () => {
	subject = await createService(KeyPairService);
});

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, {
		privateKey: identity.privateKey,
		publicKey: identity.publicKey,
	});
});

test("should generate an output from a mnemonic given a custom locale", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, {
		privateKey: identity.privateKey,
		publicKey: identity.publicKey,
	});
});

test("should fail to generate an output from an invalid mnemonic", async () => {
	await assert.rejects(() => subject.fromMnemonic(undefined));
});

test("should generate an output from a wif", async () => {
	const result = await subject.fromWIF(identity.wif);

	assert.equal(result, {
		privateKey: identity.privateKey,
		publicKey: identity.publicKey,
	});
});

test("should fail to generate an output from an invalid wif", async () => {
	await assert.rejects(() => subject.fromWIF(undefined));
});

test("should generate an output from a secret", async () => {
	await assert.rejects(
		() => subject.fromSecret(identity.mnemonic),
		"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
	);

	const result = await subject.fromSecret("abc");

	assert.equal(result, {
		privateKey: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
		publicKey: "0223542d61708e3fc48ba78fbe8fcc983ba94a520bc33f82b8e45e51dbc47af272",
	});
});

test("should fail to generate an output from an invalid wif", async () => {
	await assert.rejects(() => subject.fromSecret(undefined));
});

test.run();
