import "jest-extended";

import { Services } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking.js";

let subject: Services.AbstractLinkService;

beforeAll(async () => {
    subject = await createService(Services.AbstractLinkService);
});

it("should generate a link for a block", async () => {
    expect(subject.block("id")).toMatchInlineSnapshot(`"https://neoscan-testnet.io/block/height/id"`);
});

it("should generate a link for a transaction", async () => {
    expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://neoscan-testnet.io/tx/id"`);
});

it("should generate a link for a wallet", async () => {
    expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://neoscan-testnet.io/address/id"`);
});
