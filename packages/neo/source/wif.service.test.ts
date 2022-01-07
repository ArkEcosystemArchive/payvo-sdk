import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WIFService } from "./wif.service.js";

describe("WIFService", async ({ beforeEach, it, assert }) => {
	beforeEach(async (context) => {
		context.subject = await createService(WIFService);
	});

	it("should generate an output from a mnemonic", async (context) => {
		const result = await context.subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { wif: identity.wif });
	});
});
