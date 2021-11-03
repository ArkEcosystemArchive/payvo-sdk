import "jest-extended";

import { IoC } from "@payvo/sdk";

import { createService, require } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject: AddressService;

beforeAll(async () => {
	subject = await createService(AddressService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
	});
});

describe("Address", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ type: "bip39", address: identity.address });
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ type: "bip39", address: identity.address });
	});

	it("should generate an output from a publicKey", async () => {
		const result = await subject.fromPublicKey(identity.publicKey);

		expect(result).toEqual({ type: "bip39", address: identity.address });
	});

	it("should generate an output from a secret", async () => {
		await expect(subject.fromSecret(identity.mnemonic)).rejects.toEqual(
			new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
		);

		await expect(subject.fromSecret("secret")).resolves.toEqual({
			address: "lskn65ygkx543cg23m6db4ed8myd4ysrsu8q8pbug",
			type: "bip39",
		});
	});

	it("should validate an address", async () => {
		await expect(subject.validate(identity.address)).resolves.toBeTrue();
		await expect(subject.validate("ABC")).resolves.toBeFalse();
	});

	it("should return sender public key as an output from a multiSignature", async () => {
		const result = await subject.fromMultiSignature({
			senderPublicKey: identity.publicKey,
		});

		expect(result).toEqual({ type: "lip17", address: identity.address });
	});
});
