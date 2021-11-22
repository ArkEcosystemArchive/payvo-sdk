import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";

import { bootContainer } from "../test/mocking";
import { FeeService } from "./fee.service";

let subject;
import NodeFeesFixture from "../test/fixtures/client/node-fees.json";
import { Profile } from "./profile";

let profile;

test.before(() => {
	bootContainer();

	nock.disableNetConnect();

	nock(/.+/)
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
	profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
	profile.coins().set("ARK", "ark.devnet");

	subject = new FeeService();
});

test("should sync fees", async () => {
	assert.throws(() => subject.all("ARK", "ark.devnet"), "have not been synchronized yet");

	await subject.sync(profile, "ARK", "ark.devnet");
	assert.length(Object.keys(subject.all("ARK", "ark.devnet")), 11);
});

test("should sync fees of all coins", async () => {
	assert.throws(() => subject.all("ARK", "ark.devnet"), "have not been synchronized yet");

	await subject.syncAll(profile);

	assert.length(Object.keys(subject.all("ARK", "ark.devnet")), 11);
});

test("#findByType", async () => {
	assert.throws(() => subject.all("ARK", "ark.devnet"), "have not been synchronized yet");

	await subject.syncAll(profile);

	const fees = subject.findByType("ARK", "ark.devnet", "transfer");

	assert.is(fees.min.toHuman(), 0.00357);
	assert.is(fees.avg.toHuman(), 0.1);
	assert.is(fees.max.toHuman(), 0.1);
	assert.is(fees.static.toHuman(), 0.1);
});

test.run();
