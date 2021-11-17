import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WIFService } from "./wif.service";
import { WIF } from "@payvo/sdk-cryptography";

let subject: WIFService;

beforeEach(async () => {
	subject = await createService(WIFService);
});

describe("WIF", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ wif: identity.wif });
		expect(WIF.decode(result.wif).privateKey).toBe(identity.privateKey);
	});

	it("should generate an output from a mnemonic given a custom locale", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ wif: identity.wif });
	});

	it("should fail to generate an output from an invalid mnemonic", async () => {
		await expect(subject.fromMnemonic(undefined!)).rejects.toThrow();
	});

	it("should generate an output from a private key", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		expect(result).toEqual({ wif: identity.wif });
		expect(WIF.decode(result.wif).privateKey).toBe(identity.privateKey);
	});

	it("should generate an output from a secret", async () => {
		await expect(subject.fromSecret(identity.mnemonic)).rejects.toEqual(
			new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
		);

		const result = await subject.fromSecret("abc");

		expect(result).toEqual({ wif: "LvwxxwvWMU7BNF6VBo3vmUbHRZfsjyfrQJtDRTP5UMmtuhLWW4WU" });
	});

	it("should fail to generate an output from an invalid private key", async () => {
		await expect(subject.fromPrivateKey(undefined!)).rejects.toThrow();
	});
});
