import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

describe("KeyPairService", async ({ beforeEach, assert, it }) => {
	beforeEach(async (context) => {
		context.subject = await createService(KeyPairService);
	});

	it("should generate an output from a secret", async (context) => {
		assert.equal(await context.subject.fromSecret(identity.mnemonic), {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});
});
