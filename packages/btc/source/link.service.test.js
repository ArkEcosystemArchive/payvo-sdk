import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject;

describe("livenet", function () {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.livenet");
	});

	test("should generate a link for a block", async () => {
		assert.is(
			subject.block("id"),
			"https://blockstream.info/block/id");
	});

	test("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://blockstream.info/tx/id"`,
		);
	});

	test("should generate a link for a wallet", async () => {
		assert.is(
			subject.wallet("id"),
			"https://blockstream.info/address/id");
	});
});
describe("testnet", function () {
	test.before(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.testnet");
	});

	test("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://blockstream.info/testnet/block/id"`,
		);
	});

	test("should generate a link for a transaction", async () => {
		assert.is(
			subject.transaction("id"),
			"https://blockstream.info/testnet/tx/id");
	});

	test("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://blockstream.info/testnet/address/id"`,
		);
	});
});
