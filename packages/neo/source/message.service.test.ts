import { describe } from "@payvo/sdk-test";
import { Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { MessageService } from "./message.service.js";

describe("MessageService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(MessageService);
	});

	it("should sign and verify a message", async (context) => {
		const result = await context.subject.sign({
			message: "Hello World",
			signatory: new Signatories.Signatory(
				new Signatories.PrivateKeySignatory({
					signingKey: identity.privateKey,
					address: identity.address,
				}),
			),
		});

		assert.true(await context.subject.verify(result));
	});
});
