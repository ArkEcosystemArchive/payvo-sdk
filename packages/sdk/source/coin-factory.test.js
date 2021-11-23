/* eslint-disable sonarjs/no-identical-expressions */
import { assert, test } from "@payvo/sdk-test";

import "reflect-metadata";

import { nock } from "@payvo/sdk-test";

import { ARK } from "../../ark/distribution";
import { Request } from "../../http-fetch/distribution";
import { Coin } from "./coin";
import { CoinFactory } from "./coin-factory";

const options = { httpClient: new Request(), network: "ark.mainnet" };

test.before(async () => {
	nock.disableNetConnect();

	nock.fake("https://ark-live.payvo.com")
		.get("/api/blockchain")
		.reply(200, loader.json("test/livenet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, loader.json("test/livenet/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, loader.json("test/livenet/configuration-crypto.json"))
		.get("/api/node/syncing")
		.reply(200, loader.json("test/livenet/syncing.json"))
		.persist();

	nock.fake("https://ark-test.payvo.com")
		.get("/api/blockchain")
		.reply(200, loader.json("test/testnet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, loader.json("test/testnet/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, loader.json("test/testnet/configuration-crypto.json"))
		.get("/api/node/syncing")
		.reply(200, loader.json("test/testnet/syncing.json"))
		.persist();
});

test.after(() => nock.cleanAll());

test("should create an instance", async () => {
	assert.instance(CoinFactory.make(ARK, options), Coin);
});

test("should create multiple instances with independent containers", async () => {
	const first = CoinFactory.make(ARK, options);
	await first.__construct();

	const second = CoinFactory.make(ARK, options);
	await second.__construct();

	const third = CoinFactory.make(ARK, options);
	await third.__construct();

	// A equals A
	assert.true(first.address() === first.address());
	// B equals B
	assert.true(second.address() === second.address());
	// C equals C
	assert.true(third.address() === third.address());
	// A does not equal B
	assert.false(first.address() === second.address());
	// A does not equal C
	assert.false(first.address() === third.address());
	// B does not equal C
	assert.false(second.address() === third.address());
});

test("should create an instance with a custom network", async () => {
	const coin = CoinFactory.make(ARK, {
		httpClient: new Request(),
		network: "coin.network",
		networks: {
			"coin.network": {
				id: "coin.network",
				name: "Mainnet",
			},
		},
	});

	assert.is(coin.network().id(), "coin.network");
	assert.is(coin.network().name(), "Mainnet");
});

test.run();
