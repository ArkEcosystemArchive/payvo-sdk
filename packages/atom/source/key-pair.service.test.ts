import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service.js";

describe("KeyPairService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(KeyPairService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, {
			path: "m/44'/118'/0'/0/0",
			privateKey: "22c88ff4e97fb3831564b094129933cea8303c4b5ed8d9a872c34746e72db748",
			publicKey: "030231b08f7297f25ce80c593fec839d1fe30d1f340d12d8dcefdb2b17055bd998",
		});
	});
});
