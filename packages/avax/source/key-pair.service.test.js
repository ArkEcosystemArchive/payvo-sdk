import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject;

describe("KeyPairService", async ({ assert, beforeEach, test }) => {
	beforeEach(async () => {
		subject = await createService(KeyPairService);
	});

	test("should generate an output from a mnemonic", async () => {
		assert.equal(await subject.fromMnemonic(identity.mnemonic), {
			path: "m/44'/9000'/0'/0/0",
			privateKey: "rC7DsPL1zKuPnwnqHSnShdXxeMReKWLBJgKcuJ1ZLUCUrzRni",
			publicKey: "7qobgTQPiy3mH4tvjabDjapPVrh9Tnkb3tpn2yY37hsEyxaSjW",
		});
	});

	test("should generate an output from a privateKey", async () => {
		assert.equal(await subject.fromPrivateKey(identity.privateKey), {
			publicKey: identity.publicKey,
			privateKey: identity.privateKey,
		});
	});
});
