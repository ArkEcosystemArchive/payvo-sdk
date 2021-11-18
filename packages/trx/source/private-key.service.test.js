import { assert, test } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject;

test.before.each(async () => {
	subject = await createService(PrivateKeyService);
});

test("should generate an output from a mnemonic", async () => {
	assert.equal(await subject.fromMnemonic(identity.mnemonic), {
			"privateKey": "990156e4859ff56f433306d71b858b222372dea7c6b7af64f487059bcc97e159",
			"path": "m/44'/195'/0'/0/0"
	});
});


test.run();
