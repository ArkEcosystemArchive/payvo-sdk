import { identity } from "../test/fixtures/identity.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

beforeEach(async () => (subject = new AddressService()));

describe("Address", () => {
    it("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result).toEqual({ type: "bip39", address: identity.address });
    });

    it("should fail to generate an output from a privateKey", async () => {
        const result = await subject.fromPrivateKey(identity.privateKey);

        assert.is(result).toEqual({ type: "bip39", address: identity.address });
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate(identity.address.slice(0, 10))).resolves, false);
});
});
