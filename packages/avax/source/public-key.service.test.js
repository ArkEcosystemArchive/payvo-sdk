import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { PublicKeyService } from "./public-key.service";

let subject;

describe("PublicKeyService", async ({ assert, beforeEach, it }) => {
	beforeEach(async () => {
		subject = await createService(PublicKeyService);
	});

	it("should generate an output from a mnemonic", async () => {
		assert.equal(await subject.fromMnemonic(identity.mnemonic), {
			path: "m/44'/9000'/0'/0/0",
			publicKey: "7qobgTQPiy3mH4tvjabDjapPVrh9Tnkb3tpn2yY37hsEyxaSjW",
		});
	});
});
