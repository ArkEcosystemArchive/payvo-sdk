import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PublicKeyService } from "./public-key.service";

let subject;

describe("PublicKeyService", async ({ assert, it, beforeEach }) => {
	beforeEach(async () => {
		subject = await createService(PublicKeyService);
	});

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { publicKey: identity.publicKey });
	});

	it("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.rejects(() => subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
	});
});
