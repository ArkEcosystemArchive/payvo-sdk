import "jest-extended";

import { Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { MessageService } from "./message.service";

let subject: MessageService;

beforeEach(async () => {
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

		await expect(subject.verify(result)).resolves.toBeTrue();
	});
});
