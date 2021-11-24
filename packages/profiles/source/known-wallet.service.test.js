import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { nock } from "@payvo/sdk-test";

import { bootContainer } from "../test/mocking";
import { KnownWalletService } from "./known-wallet.service";
import { Profile } from "./profile";

let subject;

test.before(() => {
	bootContainer();
});

test.before.each(async () => {
	nock.cleanAll();

	nock.fake(/.+/)
		.get("/api/node/configuration")
		.reply(200, require("../test/fixtures/client/configuration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/delegates")
		.reply(200, require("../test/fixtures/client/delegates-1.json"))
		.get("/api/delegates?page=2")
		.reply(200, require("../test/fixtures/client/delegates-2.json"))
		.get("/ArkEcosystem/common/master/devnet/known-wallets-extended.json")
		.reply(200, [
			{
				type: "team",
				name: "ACF Hot Wallet",
				address: "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67",
			},
			{
				type: "team",
				name: "ACF Hot Wallet (old)",
				address: "AWkBFnqvCF4jhqPSdE2HBPJiwaf67tgfGR",
			},
			{
				type: "exchange",
				name: "Binance",
				address: "AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V",
			},
		])
		.persist();

	const profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
	await profile.coins().set("ARK", "ark.devnet").__construct();

	subject = new KnownWalletService();

	await subject.syncAll(profile);
});

test.after.each(() => nock.cleanAll());

test("#name", async () => {
	assert.is(subject.name("ark.devnet", "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67"), "ACF Hot Wallet");
	assert.is(subject.name("ark.devnet", "AWkBFnqvCF4jhqPSdE2HBPJiwaf67tgfGR"), "ACF Hot Wallet (old)");
	assert.is(subject.name("ark.devnet", "AWkBFnqvCF4jhqPSdE2HBPJiwaf67tgfGRa"), undefined);
});

test("#is", async () => {
	assert.true(subject.is("ark.devnet", "AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V"));
	assert.false(subject.is("ark.devnet", "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67s"));
});

test("#isExchange", async () => {
	assert.true(subject.isExchange("ark.devnet", "AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V"));
	assert.false(subject.isExchange("ark.devnet", "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67"));
	assert.false(subject.isExchange("unknown", "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67"));
});

test("#isTeam", async () => {
	assert.true(subject.isTeam("ark.devnet", "AagJoLEnpXYkxYdYkmdDSNMLjjBkLJ6T67"));
	assert.false(subject.isTeam("ark.devnet", "AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V"));
});

test.run();
