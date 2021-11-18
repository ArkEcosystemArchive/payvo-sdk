import { identity } from "../test/fixtures/identity";
import { AddressService } from "./address.service";

let subject: AddressService;

test.before.each(async () => (subject = new AddressService()));

describe("Address", () => {
    test("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    test("should fail to generate an output from a privateKey", async () => {
        const result = await subject.fromPrivateKey(identity.privateKey);

        assert.is(result, { type: "bip39", address: identity.address });
    });

    test("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate(identity.address.slice(0, 10))).resolves, false);
});
});
