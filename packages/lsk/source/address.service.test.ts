import { IoC } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking.js";
import { identity } from "../test/fixtures/identity.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

beforeAll(async () => {
    subject = await createService(AddressService, undefined, (container) => {
        container.constant(IoC.BindingType.Container, container);
    });
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

    it("should generate an output from a publicKey", async () => {
        const result = await subject.fromPublicKey(identity.publicKey);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    it("should generate an output from a secret", async () => {
        await assert.is(subject.fromSecret(identity.mnemonic)).rejects.toEqual(
            new Error("The given value is BIP39 compliant. Please use [fromMnemonic] instead."),
        );

        await assert.is(subject.fromSecret("secret")).resolves.toEqual({
            address: "lskn65ygkx543cg23m6db4ed8myd4ysrsu8q8pbug",
            type: "bip39",
        });
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate("ABC")).resolves, false);
});

it("should return sender public key as an output from a multiSignature", async () => {
    const result = await subject.fromMultiSignature({
        senderPublicKey: identity.publicKey,
    });

    assert.is(result, { type: "lip17", address: identity.address });
});
});
