import "jest-extended";

import { Services } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking";

let subject: Services.AbstractLinkService;

describe("livenet", function() {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.livenet");
	});

	it("should generate a link for a block", async () => {
		expect(subject.block("id")).toMatchInlineSnapshot(`"https://blockstream.info/block/id"`);
	});

	it("should generate a link for a transaction", async () => {
		expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://blockstream.info/tx/id"`);
	});

	it("should generate a link for a wallet", async () => {
		expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://blockstream.info/address/id"`);
	});

});
describe("testnet", function() {
	beforeAll(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.testnet");
	});

	it("should generate a link for a block", async () => {
		expect(subject.block("id")).toMatchInlineSnapshot(`"https://blockstream.info/testnet/block/id"`);
	});

	it("should generate a link for a transaction", async () => {
		expect(subject.transaction("id")).toMatchInlineSnapshot(`"https://blockstream.info/testnet/tx/id"`);
	});

	it("should generate a link for a wallet", async () => {
		expect(subject.wallet("id")).toMatchInlineSnapshot(`"https://blockstream.info/testnet/address/id"`);
	});
});
