import { assert, describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service.js";

describe("PrivateKeyService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(PrivateKeyService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { privateKey: identity.privateKey });
	});

	it("should fail to generate an output from an invalid mnemonic", async (context) => {
		await assert.rejects(() => context.subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
	});
});
