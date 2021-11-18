import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject;

test.before.each(async () => {
	subject = await createService(KeyPairService);
});

test("should generate an output from a mnemonic", async () => {
	assert.object(await subject.fromMnemonic(identity.mnemonic));
});

test.run();
