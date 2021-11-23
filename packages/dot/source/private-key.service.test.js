import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject;

describe("PrivateKeyService", async ({ beforeEach, assert, it }) => {
	beforeEach(async () => {
		subject = await createService(PrivateKeyService);
	});

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { privateKey: identity.privateKey });
	});

	it("should fail to generate an output from an invalid mnemonic", async () => {
		await assert.rejects(() => subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
	});
});
