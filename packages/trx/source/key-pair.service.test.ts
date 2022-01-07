import { assert, describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service.js";

describe("KeyPairService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(KeyPairService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.object(await context.subject.fromMnemonic(identity.mnemonic));
	});
});
