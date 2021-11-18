import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { KeyPairService } from "./key-pair.service.js";

let subject: KeyPairService;

test.before.each(async () => {
	subject = await createService(KeyPairService);
});

describe("Keys", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result).toMatchInlineSnapshot(`
		Object {
		  "path": "m/44'/148'/0'",
		  "privateKey": "SCVPKP4VG6NDJHHGQ7OLDGWO6TZMZTUCKRMKUQ3KDGHCAJ7J5RG3L7WC",
		  "publicKey": "GCGYSPQBSQCJKNDXDISBSXAM3THK7MACUVZGEMXF6XRZCPGAWCUGXVNC",
		}
	`);
	});

	it("should generate an output from a private key", async () => {
		const result = await subject.fromPrivateKey(identity.privateKey);

		assert.is(result, {
			privateKey: identity.privateKey,
			publicKey: identity.publicKey,
		});
	});
});
