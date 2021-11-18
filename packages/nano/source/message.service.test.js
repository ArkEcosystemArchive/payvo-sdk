import { assert, test } from "@payvo/sdk-test";
import { IoC, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";
import { MessageService } from "./message.service";

let subject;

test.before.each(async () => {
    subject = await createService(MessageService, undefined, (container) => {
        container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
    });
});

test("should sign and verify a message", async () => {
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

	assert.true(await subject.verify(result));
});

test.run();
