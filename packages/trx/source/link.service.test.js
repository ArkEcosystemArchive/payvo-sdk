import { describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject;

describe("LinkService", async ({ beforeAll, it, assert }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService);
	});

	it("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://shasta.tronscan.org/block/id");
	});

	it("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://shasta.tronscan.org/transaction/id");
	});

	it("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://shasta.tronscan.org/address/id");
	});
});
