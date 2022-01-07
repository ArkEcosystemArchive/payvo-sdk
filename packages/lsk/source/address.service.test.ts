import { describe } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { createService } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service.js";

describe("AddressService", async ({ beforeAll, it, assert }) => {
	beforeAll(async (context) => {
		context.subject = await createService(AddressService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a mnemonic given a custom locale", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a publicKey", async (context) => {
		const result = await context.subject.fromPublicKey(identity.publicKey);

		assert.equal(result, { type: "bip39", address: identity.address });
	});

	it("should generate an output from a secret", async (context) => {
		await assert.rejects(
			() => context.subject.fromSecret(identity.mnemonic),
			"The given value is BIP39 compliant. Please use [fromMnemonic] instead.",
		);

		assert.equal(await context.subject.fromSecret("secret"), {
			address: "lskn65ygkx543cg23m6db4ed8myd4ysrsu8q8pbug",
			type: "bip39",
		});
	});

	it("should validate an address", async (context) => {
		assert.true(await context.subject.validate(identity.address));
		assert.false(await context.subject.validate("ABC"));
	});

	it("should return sender public key as an output from a multiSignature", async (context) => {
		const result = await context.subject.fromMultiSignature({
			senderPublicKey: identity.publicKey,
		});

		assert.equal(result, { type: "lip17", address: identity.address });
	});
});
