/* eslint-disable sonarjs/no-identical-expressions */

import "jest-extended";
import "reflect-metadata";

import nock from "nock";

import { ARK } from "../../../ark/distribution/cjs";
import { Request } from "../../../http-fetch";
import { requireModule } from "../../test/mocking";
import { Coin } from "./coin";
import { CoinFactory } from "./coin-factory";

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

afterAll(() => nock.cleanAll());

it("should create an instance", async () => {
	// @ts-ignore
	expect(CoinFactory.make(ARK, options)).toBeInstanceOf(Coin);
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
	expect(first.address() === first.address()).toBeTrue();
	// B equals B
	expect(second.address() === second.address()).toBeTrue();
	// C equals C
	expect(third.address() === third.address()).toBeTrue();
	// A does not equal B
	expect(first.address() === second.address()).toBeFalse();
	// A does not equal C
	expect(first.address() === third.address()).toBeFalse();
	// B does not equal C
	expect(second.address() === third.address()).toBeFalse();
});

it("should create an instance with a custom network", async () => {
	// @ts-ignore
	const coin: Coin = CoinFactory.make(ARK, {
		httpClient: new Request(),
		network: "coin.network",
		// @ts-ignore
		networks: {
			"coin.network": {
				id: "coin.network",
				name: "Mainnet",
			},
		},
	});

	expect(coin.network().id()).toBe("coin.network");
	expect(coin.network().name()).toBe("Mainnet");
});
