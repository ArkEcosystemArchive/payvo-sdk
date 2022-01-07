import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PublicKeyService } from "./public-key.service.js";

describe("PublicKeyService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(PublicKeyService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.equal(await context.subject.fromMnemonic(identity.mnemonic), {
			publicKey: "0277a3fb802f02a0fc916370c1fe14355db6cc91d6355ac600e2039a267a7e1b3c",
			path: "m/44'/195'/0'/0/0",
		});
	});
});
