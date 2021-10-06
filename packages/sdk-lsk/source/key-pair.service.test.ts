import "jest-extended";

import { identity, identityByLocale } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject: KeyPairService;

beforeEach(async () => {
	subject = await createService(KeyPairService);
});

describe("Keys", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identityByLocale.french.mnemonic, { bip39Locale: "french" });

		expect(result).toEqual({
			privateKey: identityByLocale.french.privateKey,
			publicKey: identityByLocale.french.publicKey,
		});
	});

	it("should detect if provided input is a bip39 compliant mnemonic based on locale", async () => {
		await expect(subject.fromSecret(identityByLocale.french.mnemonic, "french")).rejects.toEqual(
			new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
		);

		await expect(subject.fromSecret(identityByLocale.french.mnemonic)).resolves.toEqual({
			privateKey: identityByLocale.french.privateKey,
			publicKey: identityByLocale.french.publicKey,
		});
	});
});
