import { assert, describe, test } from "@payvo/sdk-test";
import { Services } from "@payvo/sdk";

import { createService } from "../test/mocking";

let subject;

describe("livenet", function (suite) {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.livenet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://blockstream.info/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://blockstream.info/tx/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://blockstream.info/address/id");
	});
});

describe("testnet", function (suite) {
	suite.before(async () => {
		subject = await createService(Services.AbstractLinkService, "btc.testnet");
	});

	suite("should generate a link for a block", async () => {
		assert.is(subject.block("id"), "https://blockstream.info/testnet/block/id");
	});

	suite("should generate a link for a transaction", async () => {
		assert.is(subject.transaction("id"), "https://blockstream.info/testnet/tx/id");
	});

	suite("should generate a link for a wallet", async () => {
		assert.is(subject.wallet("id"), "https://blockstream.info/testnet/address/id");
	});
});

test.run();
