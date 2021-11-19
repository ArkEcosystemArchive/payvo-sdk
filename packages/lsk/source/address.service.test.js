import { assert, test } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { createService } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject;

test.before(async () => {
	subject = await createService(AddressService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
	});
});

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { type: "bip39", address: identity.address });
});

test("should generate an output from a mnemonic given a custom locale", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { type: "bip39", address: identity.address });
});

test("should generate an output from a publicKey", async () => {
	const result = await subject.fromPublicKey(identity.publicKey);

	assert.equal(result, { type: "bip39", address: identity.address });
});

test("should generate an output from a secret", async () => {
	await assert.rejects(
		() => subject.fromSecret(identity.mnemonic),
		"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
	);

	assert.equal(await subject.fromSecret("secret"), {
		address: "lskn65ygkx543cg23m6db4ed8myd4ysrsu8q8pbug",
		type: "bip39",
	});
});

test("should validate an address", async () => {
	assert.true(await subject.validate(identity.address));
	assert.false(await subject.validate("ABC"));
});

test("should return sender public key as an output from a multiSignature", async () => {
	const result = await subject.fromMultiSignature({
		senderPublicKey: identity.publicKey,
	});

	assert.equal(result, { type: "lip17", address: identity.address });
});

test.run();
