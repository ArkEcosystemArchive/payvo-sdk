import { Services } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking.js";

let subject: Services.AbstractLinkService;

beforeAll(async () => {
	subject = await createService(Services.AbstractLinkService);
});

it("should generate a link for a block", async () => {
	assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://testnet.steexp.com/ledger/id"`);
});

it("should generate a link for a transaction", async () => {
	assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://testnet.steexp.com/tx/id"`);
});

it("should generate a link for a wallet", async () => {
	assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://testnet.steexp.com/account/id"`);
});
