import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject;

test.before.each(async () => {
	subject = await createService(PrivateKeyService);
});

test("should generate an output from a mnemonic", async () => {
	assert.is(await subject.fromMnemonic(identity.mnemonic));
});


test.run();
