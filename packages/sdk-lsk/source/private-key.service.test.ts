import "jest-extended";

import { identity, identityByLocale } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject: PrivateKeyService;

beforeEach(async () => {
	subject = await createService(PrivateKeyService);
});

describe("PrivateKey", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ privateKey: identity.privateKey });
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identityByLocale.french.mnemonic, { bip39Locale: "french" });

		expect(result).toEqual({ privateKey: identityByLocale.french.privateKey });
	});

	it("should detect if provided input is a bip39 compliant mnemonic based on locale", async () => {
		await expect(subject.fromSecret(identityByLocale.french.mnemonic, "french")).rejects.toEqual(
			new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
		);
	});
});
