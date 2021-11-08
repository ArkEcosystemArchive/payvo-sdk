import { Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, require } from "../test/mocking";
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
				new Signatories.MnemonicSignatory({
					signingKey: identity.mnemonic,
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
				}),
			),
		});

		await expect(subject.verify(result)).resolves.toBeTrue();
	});
});
