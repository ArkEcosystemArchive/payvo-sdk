import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject: Services.AbstractLinkService;

test.before(async () => {
	subject = await createService(Services.AbstractLinkService);
});

test("should generate a link for a block", async () => {
	assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://nanocrawler.cc/explorer/block/id"`);
});

test("should generate a link for a transaction", async () => {
	assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://nanocrawler.cc/explorer/block/id"`);
});

test("should generate a link for a wallet", async () => {
	assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://nanocrawler.cc/explorer/account/id"`);
});