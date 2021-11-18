import { Services } from "@payvo/sdk";

import { createService, requireModule } from "../test/mocking";

let subject: Services.AbstractLinkService;

describe("livenet", function () {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.livenet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://blockstream.info/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://blockstream.info/tx/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://blockstream.info/address/id"`);
	});
});
describe("testnet", function () {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.testnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id")).toMatchInlineSnapshot(`"https://blockstream.info/testnet/block/id"`);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id")).toMatchInlineSnapshot(`"https://blockstream.info/testnet/tx/id"`);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id")).toMatchInlineSnapshot(`"https://blockstream.info/testnet/address/id"`);
	});
});
