import { describe } from "@payvo/sdk-test";
import "reflect-metadata";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ProfileRepository } from "./profile.repository";
import { WalletService } from "./wallet.service";

let profile;
let wallet;
let subject;

let liveSpy;
let testSpy;

describe("WalletService", ({ afterAll, afterEach, beforeAll, beforeEach, loader, nock, assert, test, stub, it }) => {
	beforeAll(() => bootContainer());

	beforeEach(async () => {
		nock.fake()
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
			// coingecho
			.get("/api/v3/coins/dark/history")
			.query(true)
			.reply(200, {
				id: "ark",
				symbol: "ark",
				name: "Ark",
				market_data: {
					current_price: {
						btc: 0.0006590832396635801,
					},
					market_cap: {
						btc: 64577.8220851173,
					},
					total_volume: {
						btc: 3054.8117101964535,
					},
				},
			})
			// coingecho
			.get("/api/v3/coins/list")
			.query(true)
			.reply(200, [
				{
					id: "ark",
					symbol: "ark",
					name: "ark",
				},
				{
					id: "dark",
					symbol: "dark",
					name: "dark",
				},
			])
			.persist();

		const profileRepository = new ProfileRepository();

		if (container.has(Identifiers.ProfileRepository)) {
			container.unbind(Identifiers.ProfileRepository);
		}

		container.constant(Identifiers.ProfileRepository, profileRepository);

		profile = profileRepository.create("John Doe");

		wallet = await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

		liveSpy = stub(wallet.network(), "isLive").returnValue(true);
		testSpy = stub(wallet.network(), "isTest").returnValue(false);

		subject = new WalletService();
	});

	afterEach(() => {
		liveSpy.restore();
		testSpy.restore();
	});

	test("#syncByProfile", async () => {
		assert.throws(() => wallet.voting().current(), /has not been synced/);

		await subject.syncByProfile(profile);

		assert.not.throws(() => wallet.voting().current(), /has not been synced/);

		// @ts-ignore
		const mockUndefinedWallets = stub(profile.wallets(), "values").returnValue([undefined]);
		await subject.syncByProfile(profile);
		mockUndefinedWallets.restore();
	});
});
