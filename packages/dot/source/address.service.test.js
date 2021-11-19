import { assert, test } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";
import { cryptoWaitReady } from "@polkadot/util-crypto";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { createKeyring } from "./factories";
import { AddressService } from "./address.service";

let subject;

test.before.each(async () => {
    await cryptoWaitReady();

    subject = await createService(AddressService, undefined, async (container) => {
        container.constant(BindingType.Keyring, createKeyring(container.get(IoC.BindingType.ConfigRepository)));
    });
});

    test("should generate an output from a mnemonic", async () => {
        const result = await subject.fromMnemonic(identity.mnemonic);

        assert.equal(result, { type: "ss58", address: identity.address });
    });

    test("should generate an output from a multiSignature", async () => {
        const result = await subject.fromMultiSignature({
            min: identity.multiSignature.min,
            publicKeys: identity.multiSignature.publicKeys,
        });

        assert.equal(result, { type: "ss58", address: identity.multiSignatureAddress });
    });

    test("should validate an address", async () => {
        assert.true(await subject.validate(identity.address));
    	assert.false(await subject.validate(identity.address.slice(0, 10)));
});

test.run();
