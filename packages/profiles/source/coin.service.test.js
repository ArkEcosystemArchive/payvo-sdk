import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { Coins } from "@payvo/sdk";
import { nock } from "@payvo/sdk-test";

import { bootContainer } from "../test/mocking";
import NodeFeesFixture from "../test/fixtures/client/node-fees.json";
import { Profile } from "./profile";
import { ICoinService, IDataRepository } from "./contracts";
import { CoinService } from "./coin.service";

let subject;

test.before(() => {
	bootContainer();

	nock.fake(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/fees")
		.query(true)
		.reply(200, NodeFeesFixture)
		.get("/api/transactions/fees")
		.query(true)
		.reply(200, require("../test/fixtures/client/transaction-fees.json"))
		.persist();
});

test.before.each(async () => {
	const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

	subject = new CoinService(profile.data());
});

test("#push", () => {
	subject.set("ARK", "ark.devnet");
	const coin = subject.get("ARK", "ark.devnet");
	assert.is(coin.network().id(), "ark.devnet");
});

test("#has", async () => {
	subject.set("ARK", "ark.devnet");

	assert.true(subject.has("ARK", "ark.devnet"));
	assert.false(subject.has("UNKNOWN", "ark.devnet"));
});

test("#get", async () => {
	subject.set("ARK", "ark.devnet");

	assert.is(subject.get("ARK", "ark.devnet").network().id(), "ark.devnet");
	assert.throws(() => subject.get("ARK", "unknown"), /does not exist/);
});

test("#values", async () => {
	subject.set("ARK", "ark.devnet");

	const values = subject.values();
	// assert.is(values, [{ ark: { devnet: expect.anything() } }]);
	assert.array(values);
	assert.instance(values[0].ark.devnet, Coins.Coin);
});

test("#all", async () => {
	subject.set("ARK", "ark.devnet");

	assert.equal(Object.keys(subject.all()), ["ARK"]);
});

test("#entries", async () => {
	subject.set("ARK", "ark.devnet");

	assert.equal(subject.entries(), [["ARK", ["ark.devnet"]]]);

	const mockUndefinedNetwork = Mockery.stub(subject, "all").returnValue({ ARK: { ark: undefined } });

	assert.equal(subject.entries(), [["ARK", ["ark"]]]);

	mockUndefinedNetwork.restore();
});

test.skip("#flush", async () => {
	const dataRepository = mock();
	subject = new CoinService(dataRepository);

	subject.flush();

	assert.is(dataRepository.flush).toHaveBeenCalled();
});

test.run();
