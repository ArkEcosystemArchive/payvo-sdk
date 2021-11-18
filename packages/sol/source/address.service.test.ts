import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

test.before.each(async () => {
    subject = await createService(AddressService);
});

describe("Address", () => {
    it("should generate an output from a mnemonic", async () => {
        await assert.is(subject.fromMnemonic(identity.mnemonic)).resolves.toEqual({
            type: "bip44",
            address: identity.address,
        });
    });

    it("should fail to generate an output from a privateKey", async () => {
        await assert.is(subject.fromPrivateKey(identity.privateKey)).resolves.toEqual({
            type: "bip44",
            address: identity.address,
        });
    });

    it("should generate an output from a publicKey", async () => {
        await assert.is(subject.fromPublicKey(identity.publicKey)).resolves.toEqual({
            type: "bip44",
            address: identity.address,
        });
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
});
});
