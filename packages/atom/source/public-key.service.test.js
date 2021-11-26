import { describe } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";

describe("PublicKeyService", async ({ beforeEach, assert, it }) => {
	beforeEach(async (context) => {
		context.subject = await createService(PublicKeyService, undefined, (container) => {
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { publicKey: identity.publicKey });
	});
});
