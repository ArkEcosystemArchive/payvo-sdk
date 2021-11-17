import { Exceptions, Services, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { MessageService } from "./message.service.js";

let subject: MessageService;

beforeEach(async () => {
	subject = await createService(MessageService);
});

describe("MessageService", () => {
	it("should sign and verify a message", async () => {
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

		await expect(subject.verify(result)).resolves.toBeTrue();
		await expect(subject.verify({} as Services.SignedMessage)).rejects.toThrow();
	});

	it("shouldn't sign and verify a invalid message", async () => {
		await expect(subject.sign({} as Services.MessageInput)).rejects.toThrow();
	});
});
