import { assert, test } from "@payvo/sdk-test";
import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";
import { PrivateKeyService } from "./private-key.service";

let subject;

test.before.each(async () => {
	subject = await createService(PrivateKeyService, undefined, (container) => {
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
	});
});

test("should generate an output from a mnemonic", async () => {
	const result = await subject.fromMnemonic(identity.mnemonic);

	assert.equal(result, { privateKey: identity.privateKey });
});

test.run();
