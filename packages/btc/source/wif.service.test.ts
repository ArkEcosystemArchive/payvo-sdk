import { identity } from "../test/fixtures/identity.js";
import { createService, requireModule } from "../test/mocking.js";
import { WIFService } from "./wif.service.js";

let subject: WIFService;

test.before.each(async () => {
	subject = await createService(WIFService);
});

describe("WIF", () => {
	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { wif: identity.wif });
	});
});
