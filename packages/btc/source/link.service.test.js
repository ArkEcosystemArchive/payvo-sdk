import { describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

describe("livenet", async ({ beforeAll, it, assert }) => {
	beforeAll(async (context) => (context.subject = await createService(Services.AbstractLinkService, "btc.livenet")));

	it("should generate a link for a block", async (context) => {
		assert.is(context.subject.block("id"), "https://blockstream.info/block/id");
	});

	it("should generate a link for a transaction", async (context) => {
		assert.is(context.subject.transaction("id"), "https://blockstream.info/tx/id");
	});

	it("should generate a link for a wallet", async (context) => {
		assert.is(context.subject.wallet("id"), "https://blockstream.info/address/id");
	});
});

describe("testnet", async ({ beforeAll, it, assert }) => {
	beforeAll(async (context) => (context.subject = await createService(Services.AbstractLinkService, "btc.testnet")));

	it("should generate a link for a block", async (context) => {
		assert.is(context.subject.block("id"), "https://blockstream.info/testnet/block/id");
	});

	it("should generate a link for a transaction", async (context) => {
		assert.is(context.subject.transaction("id"), "https://blockstream.info/testnet/tx/id");
	});

	it("should generate a link for a wallet", async (context) => {
		assert.is(context.subject.wallet("id"), "https://blockstream.info/testnet/address/id");
	});
});
