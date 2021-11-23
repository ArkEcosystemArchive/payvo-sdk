import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { StubStorage } from "../test/stubs/storage";
import { IProfile, IReadWriteWallet, ProfileSetting, WalletData } from "./contracts";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ProfileRepository } from "./profile.repository";
import { ExchangeRateService } from "./exchange-rate.service";

let profile;
let wallet;
let subject;

let liveSpy;
let testSpy;

test.before(() => bootContainer());

test.before.each(async () => {
	nock.cleanAll();

	nock.fake(/.+/)
		// ARK Core
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
		// CryptoCompare
		.get("/data/histoday")
		.query(true)
		.reply(200, require("../test/fixtures/markets/cryptocompare/historical.json"))
		.persist();

	const profileRepository = new ProfileRepository();
	subject = new ExchangeRateService();

	if (container.has(Identifiers.ProfileRepository)) {
		container.unbind(Identifiers.ProfileRepository);
	}

	container.constant(Identifiers.ProfileRepository, profileRepository);

	if (container.has(Identifiers.ExchangeRateService)) {
		container.unbind(Identifiers.ExchangeRateService);
	}

	container.constant(Identifiers.ExchangeRateService, subject);

	profile = profileRepository.create("John Doe");

	profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

	wallet = await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");
	wallet.data().set(WalletData.Balance, { available: 1e8, fees: 1e8 });

	liveSpy = Mockery.stub(wallet.network(), "isLive").returnValue(true);
	testSpy = Mockery.stub(wallet.network(), "isTest").returnValue(false);
});

test.after.each(() => {
	liveSpy.restore();
	testSpy.restore();
});

test.before(() => nock.disableNetConnect());

test("should sync a coin for specific profile with wallets argument", async () => {
	nock.fake(/.+/)
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
		.persist();

	await subject.syncAll(profile, "DARK");

	assert.is(wallet.convertedBalance(), 0.00005048);
	const allStorage = await container.get(Identifiers.Storage).all();
	assert.object(allStorage.EXCHANGE_RATE_SERVICE);
});

test("should sync a coin for specific profile without wallets argument", async () => {
	nock.fake(/.+/)
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00002134, ConversionType: { type: "direct", conversionSymbol: "" } })
		.persist();

	await subject.syncAll(profile, "DARK");

	assert.is(wallet.convertedBalance(), 0.00002134);
});

test("should fail to sync a coin for a specific profile if there are no wallets", async () => {
	profile.wallets().flush();

	assert.undefined(wallet.data().get(WalletData.ExchangeCurrency));

	await subject.syncAll(profile, "DARK");

	assert.undefined(wallet.data().get(WalletData.ExchangeCurrency));
});

test("should store exchange rates and currency in profile wallets if undefined", async () => {
	nock.fake(/.+/)
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
		.persist();

	profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

	await subject.syncAll(profile, "DARK");
	assert.is(wallet.convertedBalance(), 0.00005048);
});

test("should cache historic exchange rates", async () => {
	nock.fake(/.+/)
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
		.persist();

	profile.settings().set(ProfileSetting.MarketProvider, "cryptocompare");

	await subject.syncAll(profile, "DARK");
	assert.is(wallet.convertedBalance(), 0.00005048);

	nock.fake(/.+/)
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00005555, ConversionType: { type: "direct", conversionSymbol: "" } })
		.persist();

	await subject.syncAll(profile, "DARK");
	// The price should be the cached price from previous sync: 0.00005048
	assert.is(wallet.convertedBalance(), 0.00005048);
});

test("handle restore", async () => {
	await assert.resolves(() => subject.restore());

	assert.object(await container.get(Identifiers.Storage).get("EXCHANGE_RATE_SERVICE"));

	container.get(Identifiers.Storage).set("EXCHANGE_RATE_SERVICE", null);
	await assert.resolves(() => subject.restore());

	container.get(Identifiers.Storage).set("EXCHANGE_RATE_SERVICE", undefined);
	await assert.resolves(() => subject.restore());
});

test.run();
