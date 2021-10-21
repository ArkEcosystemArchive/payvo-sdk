import "jest-extended";
import "reflect-metadata";

import { Request } from "@payvo/http-got";
import nock from "nock";

import { ARK } from "../../../sdk-ark/distribution";
import { require } from "../../test/mocking";
import { Coin } from "./coin";
import { CoinFactory } from "./coin-factory";

const options = { network: "ark.mainnet", httpClient: new Request() };

beforeAll(async () => {
	nock.disableNetConnect();

	nock("https://ark-live.payvo.com")
		.get("/api/blockchain")
		.reply(200, await require("../test/livenet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, await require("../test/livenet/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, await require("../test/livenet/configuration-crypto.json"))
		.get("/api/node/syncing")
		.reply(200, await require("../test/livenet/syncing.json"))
		.persist();

	nock("https://ark-test.payvo.com")
		.get("/api/blockchain")
		.reply(200, await require("../test/testnet/blockchain.json"))
		.get("/api/node/configuration")
		.reply(200, await require("../test/testnet/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, await require("../test/testnet/configuration-crypto.json"))
		.get("/api/node/syncing")
		.reply(200, await require("../test/testnet/syncing.json"))
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
