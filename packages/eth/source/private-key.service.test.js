import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject;

test.before.each(async () => {
	subject = await createService(PrivateKeyService);
});

describe("PrivateKey", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { privateKey: identity.privateKey });
	});
});
