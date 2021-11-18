import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject: PrivateKeyService;

test.before.each(async () => {
	subject = await createService(PrivateKeyService);
});

describe("PrivateKey", () => {
	describe("#fromMnemonic", () => {
		test("should generate an output from a mnemonic", async () => {
			await assert.is(subject.fromMnemonic(identity.mnemonic)).resolves.toMatchInlineSnapshot(`
						Object {
						  "path": "m/44'/195'/0'/0/0",
						  "privateKey": "990156e4859ff56f433306d71b858b222372dea7c6b7af64f487059bcc97e159",
						}
					`);
		});
	});
});
