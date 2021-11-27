import { describe } from "@payvo/sdk-test";
import "reflect-metadata";

import { BigNumber } from "@payvo/sdk-helpers";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { Profile } from "./profile";
import { WalletAggregate } from "./wallet.aggregate";

let subject;
let profile;

describe("WalletAggregate", ({ beforeAll, nock, assert, it, stub }) => {
	beforeAll(async (context) => {
		bootContainer();

		nock.fake()
			.get("/api/node/configuration/crypto")
			.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
			.get("/api/peers")
			.reply(200, require("../test/fixtures/client/peers.json"))
			.get("/api/node/syncing")
			.reply(200, require("../test/fixtures/client/syncing.json"))
			.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
			.reply(200, require("../test/fixtures/client/wallet.json"))
			.persist();

		context.profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

		await importByMnemonic(context.profile, identity.mnemonic, "ARK", "ark.devnet");

		context.subject = new WalletAggregate(context.profile);
	});

	it("#balance", async (context) => {
		assert.is(context.subject.balance("test"), 558270.93444556);
		assert.is(context.subject.balance("live"), 0);
		assert.is(context.subject.balance(), 0);

		const mockWalletLive = stub(context.profile.wallets().first().network(), "isLive").returnValue(true);
		assert.is(context.subject.balance("live"), 558270.93444556);
		mockWalletLive.restore();
	});

	it("#convertedBalance", async (context) => {
		assert.is(context.subject.convertedBalance(), 0);
	});

	it("#balancesByNetworkType", async (context) => {
		assert.equal(context.subject.balancesByNetworkType(), {
			live: BigNumber.ZERO,
			test: BigNumber.make("55827093444556"),
		});
	});

	it("#balancePerCoin", async (context) => {
		assert.equal(context.subject.balancePerCoin(), {});
		assert.equal(context.subject.balancePerCoin("live"), {});

		assert.equal(context.subject.balancePerCoin("test"), {
			DARK: {
				percentage: "100.00",
				total: "558270.93444556",
			},
		});

		const mockWalletLive = stub(context.profile.wallets().first(), "balance").returnValue(0);

		assert.equal(context.subject.balancePerCoin("test"), { DARK: { percentage: "0.00", total: "0" } });
		mockWalletLive.restore();
	});
});
