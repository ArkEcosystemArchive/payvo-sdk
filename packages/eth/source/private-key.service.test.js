import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

describe("PrivateKeyService", async ({ assert, it, beforeEach }) => {
	beforeEach(async (context) => {
		context.subject = await createService(PrivateKeyService);
	});

	it("should generate an output from a mnemonic", async ({ subject }) => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { privateKey: identity.privateKey });
	});
});
