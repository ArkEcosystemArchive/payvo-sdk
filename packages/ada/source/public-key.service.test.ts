import { describe } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PublicKeyService } from "./public-key.service.js";
import { KeyPairService } from "./key-pair.service.js";

describe("PublicKeyService", async ({ assert, beforeEach, it }) => {
	beforeEach(async (context) => {
		context.subject = await createService(PublicKeyService, undefined, (container) => {
			container.constant(IoC.BindingType.Container, container);
			container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
		});
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { publicKey: identity.publicKey });
	});

	it("should fail to generate an output from an invalid mnemonic", async (context) => {
		await assert.rejects(() => context.subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
	});
});
