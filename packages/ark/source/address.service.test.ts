import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

test.before.each(async () => {
    subject = await createService(AddressService);
});

describe("Address", () => {
    it("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    it("should generate an output from a mnemonic given a custom locale", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    it("should generate an output from a multiSignature", async () => {
        const result = await subject.fromMultiSignature({
            min: identity.multiSignature.min,
            publicKeys: identity.multiSignature.publicKeys,
        });

        assert.is(result, { type: "bip39", address: "DMS861mLRrtH47QUMVif3C2rBCAdHbmwsi" });
    });

    it("should generate an output from a publicKey", async () => {
        const result = await subject.fromPublicKey(identity.publicKey);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    it("should generate an output from a privateKey", async () => {
        const result = await subject.fromPrivateKey(identity.privateKey);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    it("should generate an output from a secret", async () => {
        await assert.is(subject.fromSecret(identity.mnemonic)).rejects.toEqual(
            new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
        );

        const result = await subject.fromSecret("abc");

        assert.is(result, { type: "bip39", address: "DNTwQTSp999ezQ425utBsWetcmzDuCn2pN" });
    });

    it("should generate an output from a wif", async () => {
        const result = await subject.fromWIF(identity.wif);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate("AdVSe37niA3uFUPgCgMUH2tMsHF4LpLoiX")).resolves, false);
await assert.is(subject.validate("ABC")).resolves, false);
await assert.is(subject.validate("")).resolves, false);
await assert.is(subject.validate(undefined!)).resolves, false);
await assert.is(subject.validate(null!)).resolves, false);
await assert.is(subject.validate({} as unknown as string)).resolves, false);
});

test.each(["fromMnemonic", "fromMultiSignature", "fromPublicKey", "fromPrivateKey", "fromSecret", "fromWIF"])(
    "%s() should fail to generate an output from an invalid input",
    async (method) => {
        await assert.is(subject[method](undefined!)).rejects.toThrow();
    },
);
});
