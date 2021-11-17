import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

let subject: AddressService;

beforeEach(async () => {
	subject = await createService(AddressService);
});

describe("Address", () => {
	it("should generate an output from a publicKey", async () => {
		const result = await subject.fromPublicKey(identity.publicKey);

		expect(result).toEqual({ type: "rfc6979", address: identity.address });
	});

	it("should generate an output from a secret", async () => {
		const result = await subject.fromSecret(identity.mnemonic);

		expect(result).toEqual({ type: "rfc6979", address: identity.address });
	});

	it("should validate an address", async () => {
		await expect(subject.validate(identity.address)).resolves.toBeTrue();
		await expect(subject.validate("invalid")).resolves.toBeFalse();
	});
});
