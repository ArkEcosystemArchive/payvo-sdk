import { assert, describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject;

describe("KeyPairService", async ({ beforeEach, it, assert }) => {
	beforeEach(async () => {
		subject = await createService(KeyPairService);
	});

	it("should generate an output from a mnemonic", async () => {
		assert.object(await subject.fromMnemonic(identity.mnemonic));
	});
});
