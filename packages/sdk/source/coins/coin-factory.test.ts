/* eslint-disable sonarjs/no-identical-expressions */

import "reflect-metadata";

import nock from "nock";

import { ARK } from "../../../ark/distribution.js";
import { Request } from "../../../http-fetch.js";
import { requireModule } from "../../test/mocking.js";
import { Coin } from "./coin.js";
import { CoinFactory } from "./coin-factory.js";

const options = { httpClient: new Request(), network: "ark.mainnet" };

beforeAll(async () => {
	nock.disableNetConnect();

	nock("https://ark-live.payvo.com")
		.get("/api/blockchain")
		.reply(200, requireModule("../test/livenet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, requireModule("../test/livenet/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, requireModule("../test/livenet/configuration-crypto.json"))
		.get("/api/node/syncing")
		.reply(200, requireModule("../test/livenet/syncing.json"))
		.persist();

	nock("https://ark-test.payvo.com")
		.get("/api/blockchain")
		.reply(200, requireModule("../test/testnet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, requireModule("../test/testnet/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, requireModule("../test/testnet/configuration-crypto.json"))
		.get("/api/node/syncing")
		.reply(200, requireModule("../test/testnet/syncing.json"))
		.persist();
});

test.after(() => nock.cleanAll());

it("should create an instance", async () => {
	// @ts-ignore
	assert.is(CoinFactory.make(ARK, options) instanceof Coin);
});

it("should create multiple instances with independent containers", async () => {
	// @ts-ignore
	const first = CoinFactory.make(ARK, options);
	await first.__construct();

	// @ts-ignore
	const second = CoinFactory.make(ARK, options);
	await second.__construct();

	// @ts-ignore
	const third = CoinFactory.make(ARK, options);
	await third.__construct();

	// A equals A
	assert.is(first.address() === first.address(), true);
	// B equals B
	assert.is(second.address() === second.address(), true);
	// C equals C
	assert.is(third.address() === third.address(), true);
	// A does not equal B
	assert.is(first.address() === second.address(), false);
	// A does not equal C
	assert.is(first.address() === third.address(), false);
	// B does not equal C
	assert.is(second.address() === third.address(), false);
});

it("should create an instance with a custom network", async () => {
	// @ts-ignore
	const coin: Coin = CoinFactory.make(ARK, {
		httpClient: new Request(),
		network: "coin.network",
		networks: {
			// @ts-ignore
			"coin.network": {
				id: "coin.network",
				name: "Mainnet",
			},
		},
	});

	assert.is(coin.network().id(), "coin.network");
	assert.is(coin.network().name(), "Mainnet");
});
