import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PrivateKeyService } from "./private-key.service";

let subject;

describe("PrivateKeyService", async ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(PrivateKeyService);
	});

	it("should generate an output from a mnemonic", async () => {
		assert.equal(await subject.fromMnemonic(identity.mnemonic), {
			path: "m/44'/9000'/0'/0/0",
			privateKey: "rC7DsPL1zKuPnwnqHSnShdXxeMReKWLBJgKcuJ1ZLUCUrzRni",
		});
	});
});
