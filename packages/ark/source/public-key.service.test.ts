import "jest-extended";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
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
        const result = await subject.fromMnemonic(identity.mnemonic);

        expect(result).toEqual({ publicKey: identity.publicKey });
    });

    it("should fail to generate an output from an invalid mnemonic", async () => {
        await expect(subject.fromMnemonic(undefined!)).rejects.toThrow();
    });

    it("should generate an output from a multiSignature", async () => {
        const result = await subject.fromMultiSignature(
            identity.multiSignature.min,
            identity.multiSignature.publicKeys,
        );

        expect(result).toEqual({ publicKey: "0279f05076556da7173610a7676399c3620276ebbf8c67552ad3b1f26ec7627794" });
    });

    it("should fail to generate an output from a multiSignature", async () => {
        await expect(subject.fromMultiSignature(-1, [])).rejects.toThrow();
    });

    it("should generate an output from a wif", async () => {
        const result = await subject.fromWIF(identity.wif);

        expect(result).toEqual({ publicKey: identity.publicKey });
    });

    it("should fail to generate an output from a wif", async () => {
        await expect(subject.fromWIF(undefined!)).rejects.toThrow();
    });

    it("should generate an output from a secret", async () => {
        await expect(subject.fromSecret(identity.mnemonic)).rejects.toEqual(
            new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
        );

        const result = await subject.fromSecret("abc");

        expect(result).toEqual({ publicKey: "0223542d61708e3fc48ba78fbe8fcc983ba94a520bc33f82b8e45e51dbc47af272" });
    });

    it("should fail to generate an output from a secret", async () => {
        await expect(subject.fromSecret(undefined!)).rejects.toThrow();
    });
});
