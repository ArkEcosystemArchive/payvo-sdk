import "jest-extended";

import { IoC } from "@payvo/sdk";

import { createService } from "../test/mocking";
import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject: AddressService;

beforeAll(() => {
	subject = createService(AddressService, undefined, (container) => {
		container.constant(IoC.BindingType.Container, container);
	});
});

describe("Address", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ type: "bip39", address: identity.address });
	});

	it("should generate an output from a publicKey", async () => {
		const result = await subject.fromPublicKey(identity.publicKey);

		expect(result).toEqual({ type: "bip39", address: identity.address });
	});

	it("should validate an address", async () => {
		await expect(subject.validate(identity.address)).resolves.toBeTrue();
		await expect(subject.validate("ABC")).resolves.toBeFalse();
	});
});
