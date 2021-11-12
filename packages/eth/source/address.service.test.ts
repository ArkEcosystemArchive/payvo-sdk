import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { AddressService } from "./address.service";

let subject: AddressService;

beforeEach(async () => {
	subject = await createService(AddressService);
});

describe("Address", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toMatchInlineSnapshot(`
		Object {
		  "address": "0x986a007a43D65ff18D040AcdAd844cfE7c349135",
		  "type": "bip44",
		}
	`);
	});

	it("should generate an output from a privateKey", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		expect(result).toMatchInlineSnapshot(`
		Object {
		  "address": "0x986a007a43D65ff18D040AcdAd844cfE7c349135",
		  "type": "bip44",
		}
	`);
	});

	it("should validate an address", async () => {
		await expect(subject.validate("0x986A007A43D65FF18D040ACDAD844CFE7C349135")).resolves.toBeTrue();
		await expect(subject.validate("randomString")).resolves.toBeFalse();
	});
});
