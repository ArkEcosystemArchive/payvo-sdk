import "jest-extended";

import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { PublicKeyService } from "./public-key.service.js";

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
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ publicKey: identity.publicKey });
	});

	it("should generate an output from a secret", async () => {
		await expect(subject.fromSecret(identity.mnemonic)).rejects.toEqual(
			new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
		);

		await expect(subject.fromSecret("secret")).resolves.toEqual({
			publicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
		});
	});
});
