import { describe } from "@payvo/sdk-test";
import { identity } from "../test/fixtures/identity";
import { createService } from "../test/mocking";
import { WIFService } from "./wif.service";

let subject;

describe("WIFService", async({ beforeEach, it, assert }) => {
	beforeEach(async () => {
		subject = await createService(WIFService);
	});

	it("should generate an output from a mnemonic", async () => {
		const result = await subject.fromMnemonic(identity.mnemonic);

		assert.equal(result, { wif: identity.wif });
	});
});
