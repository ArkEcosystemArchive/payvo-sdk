import { assert, describe } from "@payvo/sdk-test";
import { IoC, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { KeyPairService } from "./key-pair.service.js";
import { MessageService } from "./message.service.js";

describe("MessageService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(MessageService, undefined, (container) => {
			container.singleton(IoC.BindingType.AddressService, AddressService);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		});
	});

	it("should sign and verify a message", async (context) => {
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

		assert.equal(result, {
			message: "Hello World",
			signatory: "TAq9SwPACv2Ut6YGJK4T8Pw57AGNmFArdP",
			signature:
				"0x7fa9bb1d8a3d0008123a4d36d61a75fe8e297345e67dc3c2cd01f1bac10ed9201516625d2745e3065cb5c279028b2372376466370ff8f1e527f282c2e98a53c21b",
		});

		assert.true(await context.subject.verify(result));
	});
});
