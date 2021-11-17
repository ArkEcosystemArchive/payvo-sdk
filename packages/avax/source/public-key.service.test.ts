import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { PublicKeyService } from "./public-key.service.js";

let subject: PublicKeyService;

beforeEach(async () => {
	subject = await createService(PublicKeyService);
});

describe("PublicKey", () => {
	it("should generate an output from a mnemonic", async () => {
		await expect(subject.fromMnemonic(identity.mnemonic)).resolves.toMatchInlineSnapshot(`
					Object {
					  "path": "m/44'/9000'/0'/0/0",
					  "publicKey": "7qobgTQPiy3mH4tvjabDjapPVrh9Tnkb3tpn2yY37hsEyxaSjW",
					}
				`);
	});
});
