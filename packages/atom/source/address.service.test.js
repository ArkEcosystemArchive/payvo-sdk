import { assert, test } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service";
import { KeyPairService } from "./key-pair.service";

let subject;

test.before.each(async () => {
	subject = await createService(AddressService, undefined, (container) => {
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
	});
});

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, {
		address: "cosmos1wqus3z856rwadvum3l0lg0nl4sc957vq0wn8d0",
		path: "m/44'/118'/0'/0/0",
		type: "bip44",
	});
});

test.run();
