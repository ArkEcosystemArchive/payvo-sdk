import { Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { MessageService } from "./message.service.js";

let subject: MessageService;

test.before.each(async () => {
    subject = await createService(MessageService);
});

describe("MessageService", () => {
    it("should sign and verify a message", async () => {
        const result = await subject.sign({
            message: "Hello World",
            signatory: new Signatories.Signatory(
                new Signatories.PrivateKeySignatory({
                    signingKey: identity.privateKey,
                    address: identity.address,
                }),
            ),
        });

        await assert.is(subject.verify(result)).resolves, true);
});
});
