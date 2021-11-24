import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject;

describe("KeyPairService", async ({ beforeEach, assert, it }) => {
	beforeEach(async () => {
		subject = await createService(KeyPairService);
	});

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});

	it("should fail from an invalid mnemonic", async () => {
		await assert.rejects(() => subject.fromMnemonic(identity.mnemonic.slice(0, 10)));
	});
});
