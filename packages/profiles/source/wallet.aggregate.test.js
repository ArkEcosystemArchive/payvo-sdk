import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { Profile } from "./profile";
import { WalletAggregate } from "./wallet.aggregate";
import { IProfile } from "./contracts";

let subject;
let profile;

test.before(() => {
	bootContainer();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.persist();
});

test.before.each(async () => {
	profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

	await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	subject = new WalletAggregate(profile);
});

test("#balance", async () => {
	assert.is(subject.balance("test"), 558270.93444556);
	assert.is(subject.balance("live"), 0);
	assert.is(subject.balance(), 0);

	const mockWalletLive = mockery(profile.wallets().first().network(), "isLive").mockReturnValue(true);
	assert.is(subject.balance("live"), 558270.93444556);
	mockWalletLive.mockRestore();
});

test("#convertedBalance", async () => {
	assert.is(subject.convertedBalance(), 0);
});

test("#balancesByNetworkType", async () => {
	assert.equal(subject.balancesByNetworkType(), {
		live: BigNumber.ZERO,
		test: BigNumber.make("55827093444556"),
	});
});

test("#balancePerCoin", async () => {
	assert.equal(subject.balancePerCoin(), {});
	assert.equal(subject.balancePerCoin("live"), {});

	assert.equal(subject.balancePerCoin("test"), {
		DARK: {
			percentage: "100.00",
			total: "558270.93444556",
		},
	});

	const mockWalletLive = mockery(profile.wallets().first(), "balance").mockReturnValue(0);

	assert.equal(subject.balancePerCoin("test"), { DARK: { percentage: "0.00", total: "0" } });
	mockWalletLive.mockRestore();
});

test.run();
