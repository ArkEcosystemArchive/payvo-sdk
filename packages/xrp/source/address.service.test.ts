import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

test.before.each(async () => {
    subject = await createService(AddressService);
});

describe("Address", () => {
    it("should generate an output from a publicKey", async () => {
        const result = await subject.fromPublicKey(identity.publicKey);

        assert.is(result, { type: "rfc6979", address: identity.address });
    });

    it("should generate an output from a secret", async () => {
        const result = await subject.fromSecret(identity.mnemonic);

        assert.is(result, { type: "rfc6979", address: identity.address });
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate("invalid")).resolves, false);
});
});
