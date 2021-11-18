import { IoC } from "@payvo/sdk";

import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";
import { PrivateKeyService } from "./private-key.service";

let subject: PrivateKeyService;

test.before.each(async () => {
	subject = await createService(PrivateKeyService, undefined, (container: IoC.Container) => {
		container.singleton(IoC.BindingType.KeyPairService, KeyPairService);
	});
});

describe("PrivateKey", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { privateKey: identity.privateKey });
	});
});
