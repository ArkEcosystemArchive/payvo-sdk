import { describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

describe("LinkService", async ({ beforeAll, assert, it }) => {
	beforeAll(async (context) => {
		context.subject = await createService(Services.AbstractLinkService);
	});

	it("should generate a link for a block", async (context) => {
		assert.is(context.subject.block("id"), "https://testnet.steexp.com/ledger/id");
	});

	it("should generate a link for a transaction", async (context) => {
		assert.is(context.subject.transaction("id"), "https://testnet.steexp.com/tx/id");
	});

	it("should generate a link for a wallet", async (context) => {
		assert.is(context.subject.wallet("id"), "https://testnet.steexp.com/account/id");
	});
});
