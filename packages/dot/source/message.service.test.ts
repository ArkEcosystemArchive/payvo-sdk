import { describe } from "@payvo/sdk-test";
import { IoC, Signatories } from "@payvo/sdk";
import { waitReady } from "@polkadot/wasm-crypto";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { createKeyring } from "./factories";
import { MessageService } from "./message.service.js";

describe("MessageService", async ({ beforeEach, assert, it, nock, loader }) => {
	beforeEach(async (context) => {
		await waitReady();

		context.subject = await createService(MessageService, undefined, async (container) => {
			container.constant(BindingType.Keyring, createKeyring(container.get(IoC.BindingType.ConfigRepository)));
		});
	});

	it("should sign a message", async (context) => {
		const result = await context.subject.sign({
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

		assert.true(await context.subject.verify(result));
	});
});
