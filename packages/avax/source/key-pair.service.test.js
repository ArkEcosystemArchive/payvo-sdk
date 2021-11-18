import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { KeyPairService } from "./key-pair.service";

let subject: KeyPairService;

test.before.each(async () => {
	subject = await createService(KeyPairService);
});

describe("Keys", () => {
	test("should generate an output from a mnemonic", async () => {
		await assert.is(subject.fromMnemonic(identity.mnemonic)).resolves.toMatchInlineSnapshot(`
					Object {
					  "path": "m/44'/9000'/0'/0/0",
					  "privateKey": "rC7DsPL1zKuPnwnqHSnShdXxeMReKWLBJgKcuJ1ZLUCUrzRni",
					  "publicKey": "7qobgTQPiy3mH4tvjabDjapPVrh9Tnkb3tpn2yY37hsEyxaSjW",
					}
				`);
	});

	test("should generate an output from a privateKey", async () => {
		await assert.is(subject.fromPrivateKey(identity.privateKey)).resolves.toEqual({
			publicKey: identity.publicKey,
			privateKey: identity.privateKey,
		});
	});
});
