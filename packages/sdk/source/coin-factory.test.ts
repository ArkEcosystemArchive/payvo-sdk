/* eslint-disable sonarjs/no-identical-expressions */
import { describe } from "@payvo/sdk-test";

import { ARK } from "../../ark/distribution/esm/index.js";
import { Request } from "../../fetch/distribution/esm/index.js";
import { Coin } from "./coin.js";
import { CoinFactory } from "./coin-factory.js";

describe("CoinFactory", ({ assert, beforeEach, loader, nock, it }) => {
	beforeEach(async (context) => {
		context.options = {
			httpClient: new Request(),
			ledgerTransportFactory: async () => {
				//
			},
			network: "ark.mainnet",
		};

		nock.fake("https://ark-live.payvo.com:443")
			.get("/api/blockchain")
			.reply(200, loader.json("test/livenet/blockchain.json"))
			.get("/api/node/configuration")
			.reply(200, loader.json("test/livenet/configuration.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, loader.json("test/livenet/configuration-crypto.json"))
			.get("/api/node/syncing")
			.reply(200, loader.json("test/livenet/syncing.json"))
			.persist();

		nock.fake("https://ark-test.payvo.com:443")
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

	it("should create an instance", async (context) => {
		assert.instance(CoinFactory.make(ARK, context.options), Coin);
	});

	it("should create multiple instances with independent containers", async (context) => {
		const first = CoinFactory.make(ARK, context.options);
		await first.__construct();

		const second = CoinFactory.make(ARK, context.options);
		await second.__construct();

		const third = CoinFactory.make(ARK, context.options);
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

	it("should create an instance with a custom network", async () => {
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
});
