import { describe } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject;

describe("LinkService", async ({ assert, beforeAll, test }) => {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService);
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://explorer.avax-test.network/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://explorer.avax-test.network/tx/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://explorer.avax-test.network/address/id");
	});
});
