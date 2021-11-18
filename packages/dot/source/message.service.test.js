import { IoC, Signatories } from "@payvo/sdk";
import { waitReady } from "@polkadot/wasm-crypto";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { createKeyring } from "./factories";
import { MessageService } from "./message.service";

let subject: MessageService;

test.before.each(async () => {
    await waitReady();

    subject = await createService(MessageService, undefined, async (container) => {
        container.constant(BindingType.Keyring, createKeyring(container.get(IoC.BindingType.ConfigRepository));
    });
});

describe("MessageService", () => {
    test("should sign a message", async () => {
        const result = await subject.sign({
            message: "Hello World",
            signatory: new Signatories.Signatory(
                new Signatories.MnemonicSignatory({
                    signingKey: identity.mnemonic,
                    address: identity.address,
                    publicKey: identity.publicKey,
                    privateKey: identity.privateKey,
                }),
            ),
        });

        await assert.is(subject.verify(result)).resolves, true);
});
});
