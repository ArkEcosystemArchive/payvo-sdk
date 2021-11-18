import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { KeyPairService } from "./key-pair.service.js";

let subject: KeyPairService;

test.before.each(async () => {
	subject = await createService(KeyPairService);
});

describe("Keys", () => {
	it("should generate an output from a secret", async () => {
		const result = await subject.fromSecret(identity.mnemonic);

		assert.is(result, {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});
});
