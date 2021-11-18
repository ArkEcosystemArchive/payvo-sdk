import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, mockWallet } from "../test/mocking";
import { BindingType } from "./constants";
import { AddressService } from "./address.service";

let subject: AddressService;

test.before.each(async () => {
    subject = await createService(AddressService, undefined, (container: IoC.Container) => {
        container.constant(BindingType.Zilliqa, mockWallet());
    });
});

describe("Address", () => {
    test("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result, { type: "bip44", address: identity.bech32Address });
    });

    test("should generate an output from a privateKey", async () => {
        const result = await subject.fromPrivateKey(identity.privateKey);

        assert.is(result, { type: "bip44", address: identity.bech32Address });
    });

    test("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate(identity.bech32Address)).resolves, true);
await assert.is(subject.validate(identity.address.slice(0, 10))).resolves, false);
    });
});
