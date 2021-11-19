import { assert, describe, test } from "@payvo/sdk-test";
import { IoC, Signatories } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { BindingType } from "./constants";
import { AddressService } from "./address.service";
import { AddressFactory } from "./address.factory";
import { MessageService } from "./message.service";

let subject;

test.before.each(async () => {
	subject = await createService(MessageService, undefined, (container) => {
		container.singleton(IoC.BindingType.AddressService, AddressService);
		container.singleton(BindingType.AddressFactory, AddressFactory);
	});
});

test("should sign and verify a message", async () => {
	const result = await subject.sign({
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

	assert.true(await subject.verify(result));
});

test.run();
