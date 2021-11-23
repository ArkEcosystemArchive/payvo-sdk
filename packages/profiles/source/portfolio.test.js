import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import nock from "nock";
import { UUID } from "@payvo/sdk-cryptography";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { Wallet } from "./wallet";
import { IExchangeRateService, IProfile, IProfileRepository, IReadWriteWallet, WalletData } from "./contracts";

let profile;
let subject;

test.before(() => bootContainer());

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
		// default wallet
		.get("/api/wallets/D94iLJaZSbjXG6XaR9BGRVBfzzYmxNt1Bi")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/wallets/DTShJdDKECzQLW3uomKfuPvmU51sxyNWUL")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/wallets/DQzosAzwyYStw2bUeUTCUnqiMonEz9ER2o")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		// CryptoCompare
		.get("/data/histoday")
		.query(true)
		.reply(200, require("../test/fixtures/markets/cryptocompare/historical.json"))
		.persist();

	const profileRepository = container.get(Identifiers.ProfileRepository);
	profileRepository.flush();
	profile = profileRepository.create("John Doe");

	subject = await profile.walletFactory().fromMnemonicWithBIP39({
		coin: "ARK",
		network: "ark.devnet",
		mnemonic: identity.mnemonic,
	});
});

test.before(() => nock.disableNetConnect());

test("should aggregate the balances of all wallets", async () => {
	nock.fake(/.+/)
		.get("/data/dayAvg")
		.query(true)
		.reply(200, { BTC: 0.00005048, ConversionType: { type: "direct", conversionSymbol: "" } })
		.persist();

	const [a, b, c] = await Promise.all([
		importByMnemonic(
			profile,
			"bomb open frame quit success evolve gain donate prison very rent later",
			"ARK",
			"ark.devnet",
		),
		importByMnemonic(
			profile,
			"dizzy feel dinosaur one custom excuse mutual announce shrug stamp rose arctic",
			"ARK",
			"ark.devnet",
		),
		importByMnemonic(
			profile,
			"citizen door athlete item name various drive onion foster audit board myself",
			"ARK",
			"ark.devnet",
		),
	]);
	a.data().set(WalletData.Balance, { available: 1e8, fees: 1e8 });
	b.data().set(WalletData.Balance, { available: 1e8, fees: 1e8 });
	c.data().set(WalletData.Balance, { available: 1e8, fees: 1e8 });

	Mockery.stub(a.network(), "isLive").returnValue(true);
	Mockery.stub(a.network(), "isTest").returnValue(false);
	Mockery.stub(a.network(), "ticker").returnValue("ARK");

	await container.get(Identifiers.ExchangeRateService).syncAll(profile, "ARK");

	assert.is(profile.portfolio().breakdown()[0].source, 3);
	assert.is(profile.portfolio().breakdown()[0].target, 0.00015144);
	assert.is(profile.portfolio().breakdown()[0].shares, 100);
});

test("should ignore test network wallets", async () => {
	await Promise.all([
		importByMnemonic(
			profile,
			"bomb open frame quit success evolve gain donate prison very rent later",
			"ARK",
			"ark.devnet",
		),
		importByMnemonic(
			profile,
			"dizzy feel dinosaur one custom excuse mutual announce shrug stamp rose arctic",
			"ARK",
			"ark.devnet",
		),
		importByMnemonic(
			profile,
			"citizen door athlete item name various drive onion foster audit board myself",
			"ARK",
			"ark.devnet",
		),
	]);

	assert.equal(profile.portfolio().breakdown(), []);
});

test.run();
