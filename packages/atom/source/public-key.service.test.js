import { assert, test } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";
import { PublicKeyService } from "./public-key.service";

let subject;

test.before.each(async () => {
	subject = await createService(PublicKeyService, undefined, (container) => {
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
	});
});

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { publicKey: identity.publicKey });
});

test.run();
