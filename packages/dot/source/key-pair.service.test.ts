import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service.js";

describe("KeyPairService", async ({ beforeEach, assert, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(KeyPairService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});

	it("should fail from an invalid mnemonic", async (context) => {
		await assert.rejects(() => context.subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
	});
});
