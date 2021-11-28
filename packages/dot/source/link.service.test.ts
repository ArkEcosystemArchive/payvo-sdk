import { describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

describe("LinkService", async ({ beforeAll, assert, it, nock, loader }) => {
	beforeAll(async (context) => {
		context.subject = await createService(Services.AbstractLinkService);
	});

	it("should generate a link for a block", (context) => {
		assert.is(context.subject.block("id"), "https://polkascan.io/block/id");
	});

	it("should generate a link for a transaction", (context) => {
		assert.is(context.subject.transaction("id"), "https://polkascan.io/tx/id");
	});

	it("should generate a link for a wallet", (context) => {
		assert.is(context.subject.wallet("id"), "https://polkascan.io/address/id");
	});
});
