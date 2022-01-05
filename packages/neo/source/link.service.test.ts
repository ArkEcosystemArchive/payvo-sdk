import { describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

describe("LinkService", async ({ beforeAll, it, assert }) => {
	beforeAll(async (context) => {
		context.subject = await createService(Services.AbstractLinkService);
	});

	it("should generate a link for a block", (context) => {
		assert.is(context.subject.block("id"), "https://neoscan-testnet.io/block/height/id");
	});

	it("should generate a link for a transaction", (context) => {
		assert.is(context.subject.transaction("id"), "https://neoscan-testnet.io/tx/id");
	});

	it("should generate a link for a wallet", (context) => {
		assert.is(context.subject.wallet("id"), "https://neoscan-testnet.io/address/id");
	});
});
