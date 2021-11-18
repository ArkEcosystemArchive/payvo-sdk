import { IoC, Signatories } from "@payvo/sdk";
import { waitReady } from "@polkadot/wasm-crypto";

import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { BindingType } from "./constants.js";
import { createKeyring } from "./factories.js";
import { MessageService } from "./message.service.js";

let subject: MessageService;

beforeEach(async () => {
    await waitReady();

    subject = await createService(MessageService, undefined, async (container: IoC.Container) => {
        container.constant(BindingType.Keyring, createKeyring(container.get(IoC.BindingType.ConfigRepository)));
    });
});

describe("MessageService", () => {
    it("should sign a message", async () => {
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
