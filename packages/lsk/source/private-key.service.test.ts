import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { PrivateKeyService } from "./private-key.service.js";

let subject: PrivateKeyService;

beforeEach(async () => {
	subject = await createService(PrivateKeyService);
});

describe("PrivateKey", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result).toEqual({ privateKey: identity.privateKey });
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result).toEqual({ privateKey: identity.privateKey });
	});

	it("should generate an output from a secret", async () => {
		await assert
			.is(subject.fromSecret(identity.mnemonic))
			.rejects.toEqual(new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."));

		const result = await subject.fromSecret("abc");

		assert.is(result).toEqual({
			privateKey: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
		});
	});
});
