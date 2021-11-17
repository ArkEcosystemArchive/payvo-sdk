import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { PrivateKeyService } from "./private-key.service.js";

let subject: PrivateKeyService;

beforeEach(async () => {
	subject = await createService(PrivateKeyService);
});

describe("PrivateKey", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		expect(result).toEqual({ privateKey: identity.privateKey });
	});
});
