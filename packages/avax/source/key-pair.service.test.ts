import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service.js";

describe("KeyPairService", async ({ assert, beforeEach, it, nock, loader }) => {
	beforeEach(async (context) => {
		context.subject = await createService(KeyPairService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		assert.equal(await context.subject.fromMnemonic(identity.mnemonic), {
			path: "m/44'/9000'/0'/0/0",
			privateKey: "rC7DsPL1zKuPnwnqHSnShdXxeMReKWLBJgKcuJ1ZLUCUrzRni",
			publicKey: "7qobgTQPiy3mH4tvjabDjapPVrh9Tnkb3tpn2yY37hsEyxaSjW",
		});
	});

	it("should generate an output from a privateKey", async (context) => {
		assert.equal(await context.subject.fromPrivateKey(identity.privateKey), {
			publicKey: identity.publicKey,
			privateKey: identity.privateKey,
		});
	});
});
