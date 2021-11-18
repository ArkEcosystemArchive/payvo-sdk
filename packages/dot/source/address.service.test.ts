import { IoC } from "@payvo/sdk";
import { cryptoWaitReady } from "@polkadot/util-crypto";

import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { BindingType } from "./constants.js";
import { createKeyring } from "./factories.js";
import { AddressService } from "./address.service.js";

let subject: AddressService;

test.before.each(async () => {
    await cryptoWaitReady();

    subject = await createService(AddressService, undefined, async (container: IoC.Container) => {
        container.constant(BindingType.Keyring, createKeyring(container.get(IoC.BindingType.ConfigRepository)));
    });
});

describe("Address", () => {
    it("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.is(result, { type: "ss58", address: identity.address });
    });

    it("should generate an output from a multiSignature", async () => {
        const result = await subject.fromMultiSignature({
            min: identity.multiSignature.min,
            publicKeys: identity.multiSignature.publicKeys,
        });

        assert.is(result, { type: "ss58", address: identity.multiSignatureAddress });
    });

    it("should validate an address", async () => {
        await assert.is(subject.validate(identity.address)).resolves, true);
    await assert.is(subject.validate(identity.address.slice(0, 10))).resolves, false);
});
});
