import { identity } from "../test/fixtures/identity";
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
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});

	it("should generate an output from a secret", async () => {
		await expect(subject.fromSecret(identity.mnemonic)).rejects.toEqual(
			new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
		);

		await expect(subject.fromSecret("secret")).resolves.toEqual({
			privateKey: "2bb80d537b1da3e38bd30361aa855686bde0eacd7162fef6a25fe97bf527a25b",
			publicKey: "5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09",
		});
	});
});
