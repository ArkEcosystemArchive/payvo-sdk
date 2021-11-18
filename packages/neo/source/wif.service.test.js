import { identity } from "../test/fixtures/identity";
import { createService, requireModule } from "../test/mocking";
import { WIFService } from "./wif.service";

let subject: WIFService;

test.before.each(async () => {
	subject = await createService(WIFService);
});

describe("WIF", () => {
	test("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.is(result, { wif: identity.wif });
	});
});
