import { IoC } from "@payvo/sdk";
import { cryptoWaitReady } from "@polkadot/util-crypto";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { createKeyring } from "./factories";
import { AddressService } from "./address.service";

let subject: AddressService;

test.before.each(async () => {
    await cryptoWaitReady();

    subject = await createService(AddressService, undefined, async (container: IoC.Container) => {
        container.constant(BindingType.Keyring, createKeyring(container.get(IoC.BindingType.ConfigRepository)));
    });
});

describe("Address", () => {
    test("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result, { type: "ss58", address: identity.address });
    });

    test("should generate an output from a multiSignature", async () => {
        const result = await subject.fromMultiSignature({
            min: identity.multiSignature.min,
            publicKeys: identity.multiSignature.publicKeys,
        });

        assert.is(result, { type: "ss58", address: identity.multiSignatureAddress });
    });

    test("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate(identity.address.slice(0, 10))).resolves, false);
});
});
