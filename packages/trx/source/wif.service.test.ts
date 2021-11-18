import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { WIFService } from "./wif.service.js";

let subject: WIFService;

test.before.each(async () => {
	subject = await createService(WIFService);
});

describe("WIF", () => {
	describe("#fromMnemonic", () => {
		it("should generate an output from a mnemonic", async () => {
			await assert.is(subject.fromMnemonic(identity.mnemonic)).resolves.toMatchInlineSnapshot(`
						Object {
						  "path": "m/44'/195'/0'/0/0",
						  "wif": "L2M8fs13JtFto4VZVN9fh3vVB2bFmEs3ykJmwuxTSpkA7yTCSUf8",
						}
					`);
		});
	});
});
