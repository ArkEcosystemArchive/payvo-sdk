import { describe } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { AddressService } from "./address.service.js";
import { KeyPairService } from "./key-pair.service.js";

describe("AddressService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(AddressService, undefined, (container) => {
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.equal(await context.subject.fromMnemonic(identity.mnemonic), {
			address: "cosmos1wqus3z856rwadvum3l0lg0nl4sc957vq0wn8d0",
			path: "m/44'/118'/0'/0/0",
			type: "bip44",
		});
	});
});
