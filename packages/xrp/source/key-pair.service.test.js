import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject;

describe("KeyPairService", async ({ beforeEach, assert, it }) => {
	beforeEach(async () => {
		subject = await createService(KeyPairService);
	});

	it("should generate an output from a secret", async () => {
		assert.equal(await subject.fromSecret(identity.mnemonic), {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});
});
