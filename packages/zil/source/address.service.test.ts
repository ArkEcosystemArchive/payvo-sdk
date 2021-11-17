import "jest-extended";

import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity.js";
import { createService, mockWallet } from "../test/mocking.js";
import { BindingType } from "./constants.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

beforeEach(async () => {
	subject = await createService(AddressService, undefined, (container: IoC.Container) => {
		container.constant(BindingType.Zilliqa, mockWallet());
	});
});

describe("Address", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ type: "bip44", address: identity.bech32Address });
	});

	it("should generate an output from a privateKey", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		expect(result).toEqual({ type: "bip44", address: identity.bech32Address });
	});

	it("should validate an address", async () => {
		await expect(subject.validate(identity.address)).resolves.toBeTrue();
		await expect(subject.validate(identity.bech32Address)).resolves.toBeTrue();
		await expect(subject.validate(identity.address.slice(0, 10))).resolves.toBeFalse();
	});
});
