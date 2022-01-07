import { describe } from "@payvo/sdk-test";
import { IoC, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { AddressService } from "./address.service.js";
import { AddressFactory } from "./address.factory.js";
import { MessageService } from "./message.service.js";

describe("MessageService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(MessageService, undefined, (container) => {
			container.singleton(BindingType.AddressFactory, AddressFactory);
			container.singleton(IoC.BindingType.AddressService, AddressService);
		});
	});

	it("should sign and verify a message", async (context) => {
		const result = await context.subject.sign({
			message: "This is an example of a signed message.",
			signatory: new Signatories.Signatory(
				new Signatories.MnemonicSignatory({
					signingKey: "5KYZdUEo39z3FPrtuX2QbbwGnNP5zTd7yyr2SC1j299sBCnWjss",
					address: identity.address,
					publicKey: identity.publicKey,
					privateKey: identity.privateKey,
					options: {
						bip44: {
							account: 0,
						},
					},
				}),
			),
		});

		assert.true(await context.subject.verify(result));
	});
});
