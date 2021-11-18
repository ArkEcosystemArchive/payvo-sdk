import { Services } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking";

let subject: Services.AbstractLinkService;

beforeAll(async () => {
	subject = await createService(Services.AbstractLinkService);
});

it("should generate a link for a block", async () => {
	assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://viewblock.io/block/id?network=testnet"`);
});

it("should generate a link for a transaction", async () => {
	assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://viewblock.io/tx/id?network=testnet"`);
});

it("should generate a link for a wallet", async () => {
	assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://viewblock.io/address/id?network=testnet"`);
});
