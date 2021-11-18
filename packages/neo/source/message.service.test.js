import { assert, test } from "@payvo/sdk-test";
import { Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { MessageService } from "./message.service";

let subject;

test.before.each(async () => {
	subject = await createService(MessageService);
});

test("should sign and verify a message", async () => {
	const result = await subject.sign({
		message: "Hello World",
		signatory: new Signatories.Signatory(
			new Signatories.PrivateKeySignatory({
				signingKey: identity.privateKey,
				address: identity.address,
			}),
		),
	});

	assert.true(await subject.verify(result));
});

test.run();
