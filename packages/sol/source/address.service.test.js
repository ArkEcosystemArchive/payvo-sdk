import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => {
    subject = await createService(AddressService);
});

describe("Address", () => {
    test("should generate an output from a mnemonic", async () => {
        await assert.is(subject.fromMnemonic(identity.mnemonic)).resolves.toEqual({
            type: "bip44",
            address: identity.address,
        });
    });

    test("should fail to generate an output from a privateKey", async () => {
        await assert.is(subject.fromPrivateKey(identity.privateKey)).resolves.toEqual({
            type: "bip44",
            address: identity.address,
        });
    });

    test("should generate an output from a publicKey", async () => {
        await assert.is(subject.fromPublicKey(identity.publicKey)).resolves.toEqual({
            type: "bip44",
            address: identity.address,
        });
    });

    test("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
});
});
