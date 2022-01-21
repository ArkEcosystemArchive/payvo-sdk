import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PublicKeyService } from "./public-key.service.js";

describe("PublicKeyService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(PublicKeyService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.equal(await context.subject.fromMnemonic(identity.mnemonic), { publicKey: identity.publicKey });
	});

	it("should generate an output from a wif", async (context) => {
		assert.equal(await context.subject.fromWIF(identity.wif), { publicKey: identity.publicKey });
	});
});
