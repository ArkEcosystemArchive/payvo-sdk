import "jest-extended";

import { identity, identityByLocale } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
import { PublicKeyService } from "./public-key.service";

let subject: PublicKeyService;

beforeEach(async () => {
	subject = await createService(PublicKeyService);
});

describe("PublicKey", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ publicKey: identity.publicKey });
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identityByLocale.french.mnemonic, { bip39Locale: "french" });

		expect(result).toEqual({ publicKey: identityByLocale.french.publicKey });
	});

	it("should detect if provided input is a bip39 compliant mnemonic based on locale", async () => {
		await expect(subject.fromSecret(identityByLocale.french.mnemonic, "french")).rejects.toEqual(
			new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
		);

		await expect(subject.fromSecret(identityByLocale.french.mnemonic)).resolves.toEqual({
			publicKey: identityByLocale.french.publicKey,
		});
	});
});
