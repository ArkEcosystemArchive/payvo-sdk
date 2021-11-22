import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { resolve } from "path";
import { Request } from "@payvo/sdk-http-fetch";
import { ARK } from "@payvo/sdk-ark";
import { BTC } from "@payvo/sdk-btc";
import { ETH } from "@payvo/sdk-eth";
import fs from "fs-extra";
import nock from "nock";

import storageData from "../test/fixtures/env-storage.json";
import { identity } from "../test/fixtures/identity";
import { importByMnemonic } from "../test/mocking";
import { StubStorage } from "../test/stubs/storage";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ProfileData } from "./contracts";
import { DataRepository } from "./data.repository";
import { Environment } from "./env";
import { ExchangeRateService } from "./exchange-rate.service";
import { MemoryStorage } from "./memory.storage";
import { PluginRegistry } from "./plugin-registry.service";
import { Profile } from "./profile";
import { ProfileImporter } from "./profile.importer";
import { ProfileRepository } from "./profile.repository";
import { ProfileSerialiser } from "./profile.serialiser";
import { WalletService } from "./wallet.service";

let subject;

const makeSubject = async () => {
	subject = new Environment({
		coins: { ARK, BTC, ETH },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});
	await subject.verify();
	await subject.boot();
	await subject.persist();
};

test.before(() => {
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
		.reply(200, require("../test/fixtures/client/node-fees.json"))
		.get("/api/transactions/fees")
		.query(true)
		.reply(200, require("../test/fixtures/client/transaction-fees.json"))
		.get("/api/delegates")
		.query(true)
		.reply(200, require("../test/fixtures/client/delegates-1.json"))
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
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get(/.+/)
		.query(true)
		.reply(200, (url) => {
			console.log("getting url", url);
			return { meta: {}, data: {} };
		})
		.persist();
});

test.before.each(async () => {
	fs.removeSync(resolve(__dirname, "../test/stubs/env.json"));

	container.flush();
});

test("should have a profile repository", async () => {
	await makeSubject();

	assert.instance(subject.profiles(), ProfileRepository);
});

test("should have a data repository", async () => {
	await makeSubject();

	assert.instance(subject.data(), DataRepository);
});

test("should have a plugin registry", async () => {
	await makeSubject();

	assert.instance(subject.plugins(), PluginRegistry);
});

test("should have available networks", async () => {
	await makeSubject();

	assert.length(subject.availableNetworks(), 14);

	for (const network of subject.availableNetworks()) {
		assert.object(network.toObject());
	}
});

test("should set migrations", async () => {
	await makeSubject();

	assert.false(container.has(Identifiers.MigrationSchemas));
	assert.false(container.has(Identifiers.MigrationVersion));

	subject.setMigrations({}, "1.0.0");

	assert.true(container.has(Identifiers.MigrationSchemas));
	assert.true(container.has(Identifiers.MigrationVersion));
});

test.skip("should create a profile with data and persist it when instructed to do so", async () => {
	await makeSubject();

	/**
	 * Save data in the current environment.
	 */

	const profile = subject.profiles().create("John Doe");

	// Create a Contact
	profile.contacts().create("Jane Doe", [
		{
			coin: "ARK",
			network: "ark.devnet",
			address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		},
	]);

	// Create a Wallet
	await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	// Create a Notification
	profile
		.notifications()
		.releases()
		.push({
			name: "Update Available",
			body: "...",
			meta: { version: "3.0.0" },
		});

	// Create a DataEntry
	profile.data().set(ProfileData.LatestMigration, "0.0.0");

	// Create a Setting
	profile.settings().set("ADVANCED_MODE", false);

	// Encode all data
	subject.profiles().persist(profile);

	// Create a Global DataEntry
	subject.data().set("KEY", "VALUE");

	// Persist the data for the next instance to use.
	await subject.persist();

	/**
	 * Load data that the previous environment instance saved.
	 */

	container.flush();

	const newEnv = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});
	await newEnv.verify();
	await newEnv.boot();

	const newProfile = newEnv.profiles().findById(profile.id());

	assert.instance(newProfile, Profile);

	await new ProfileImporter(newProfile).import();
	await newProfile.sync();

	assert.length(newProfile.wallets().keys(), 1);
	assert.length(newProfile.contacts().keys(), 1);
	assert.is(newProfile.notifications().count(), 1);
	assert.equal(newProfile.data().all(), {
		LATEST_MIGRATION: "0.0.0",
	});
	assert.equal(newProfile.settings().all(), {
		ACCENT_COLOR: "green",
		ADVANCED_MODE: false,
		AUTOMATIC_SIGN_OUT_PERIOD: 15,
		BIP39_LOCALE: "english",
		DASHBOARD_TRANSACTION_HISTORY: true,
		DO_NOT_SHOW_FEE_WARNING: false,
		ERROR_REPORTING: false,
		EXCHANGE_CURRENCY: "BTC",
		LOCALE: "en-US",
		MARKET_PROVIDER: "cryptocompare",
		NAME: "John Doe",
		SCREENSHOT_PROTECTION: true,
		THEME: "light",
		TIME_FORMAT: "h:mm A",
		USE_EXPANDED_TABLES: false,
		USE_NETWORK_WALLET_NAMES: false,
		USE_TEST_NETWORKS: false,
	});
});

test("should boot the environment from fixed data", async () => {
	const env = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});
	await env.verify(storageData);
	await env.boot();

	const newProfile = env.profiles().findById("8101538b-b13a-4b8d-b3d8-e710ccffd385");

	await new ProfileImporter(newProfile).import();

	assert.instance(newProfile, Profile);
	assert.length(newProfile.wallets().keys(), 1);
	assert.length(newProfile.contacts().keys(), 1);
	assert.is(newProfile.notifications().count(), 1);
	assert.equal(newProfile.data().all(), {
		LATEST_MIGRATION: "0.0.0",
	});
	assert.equal(newProfile.settings().all(), {
		ACCENT_COLOR: "green",
		ADVANCED_MODE: false,
		AUTOMATIC_SIGN_OUT_PERIOD: 15,
		BIP39_LOCALE: "english",
		EXCHANGE_CURRENCY: "BTC",
		DASHBOARD_TRANSACTION_HISTORY: false,
		DO_NOT_SHOW_FEE_WARNING: false,
		ERROR_REPORTING: false,
		LOCALE: "en-US",
		MARKET_PROVIDER: "cryptocompare",
		NAME: "John Doe",
		SCREENSHOT_PROTECTION: true,
		THEME: "light",
		TIME_FORMAT: "h:mm A",
		USE_EXPANDED_TABLES: false,
		USE_NETWORK_WALLET_NAMES: false,
		USE_TEST_NETWORKS: false,
	});

	const restoredWallet = newProfile.wallets().first();
	assert.equal(restoredWallet.settings().all(), {
		AVATAR: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="picasso" width="100" height="100" viewBox="0 0 100 100"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill="rgb(233, 30, 99)" width="100" height="100"/><circle r="50" cx="60" cy="40" fill="rgb(139, 195, 74)"/><circle r="45" cx="0" cy="30" fill="rgb(0, 188, 212)"/><circle r="40" cx="90" cy="50" fill="rgb(255, 193, 7)"/></svg>',
	});

	assert.is(restoredWallet.alias(), undefined);
});

test("should boot with empty storage data", async () => {
	const env = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});

	assert.undefined(await env.verify({ profiles: storageData.profiles, data: {} }));
	assert.undefined(await env.boot());
});

test("should boot with empty storage profiles", async () => {
	const env = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});

	assert.undefined(await env.verify({ profiles: {}, data: { key: "value" } }));
	assert.undefined(await env.boot());
});

test("should boot with exchange service data", async () => {
	const env = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});

	container.get(Identifiers.Storage).set("EXCHANGE_RATE_SERVICE", {});

	assert.undefined(await env.verify({ profiles: {}, data: {} }));
	assert.undefined(await env.boot());
});

test("should create preselected storage given storage option as string", async () => {
	const env = new Environment({ coins: { ARK }, httpClient: new Request(), storage: "memory" });
	assert.instance(container.get(Identifiers.Storage), MemoryStorage);
});

test("should throw error when calling boot without verify first", async () => {
	const env = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});
	await assert.rejects(() => env.boot(), "Please call [verify] before booting the environment.");
});

test("#exchangeRates", async () => {
	await makeSubject();

	assert.instance(subject.exchangeRates(), ExchangeRateService);
});

test.skip("#fees", async () => {
	await makeSubject();

	await subject.fees().sync(subject.profiles().create("John"), "ARK", "ark.devnet");
	assert.length(Object.keys(subject.fees().all("ARK", "ark.devnet")), 11);
});

test.skip("#delegates", async () => {
	await makeSubject();

	await subject.delegates().sync(subject.profiles().create("John"), "ARK", "ark.devnet");
	assert.length(subject.delegates().all("ARK", "ark.devnet"), 200);
});

test("#knownWallets", async () => {
	await makeSubject();

	await subject.knownWallets().syncAll(subject.profiles().create("John Doe"));
	assert.false(subject.knownWallets().is("ark.devnet", "unknownWallet"));
});

test("#wallets", async () => {
	await makeSubject();

	assert.instance(subject.wallets(), WalletService);
});

test("should register a coin and deregister it", async () => {
	const env = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});
	await env.verify(storageData);
	await env.boot();

	env.registerCoin("BTC", BTC);
	assert.throws(() => env.registerCoin("BTC", BTC), /is already registered/);
	assert.not.throws(() => env.deregisterCoin("BTC"));
});

test("should fail verification", async () => {
	const env = new Environment({
		coins: { ARK },
		httpClient: new Request(),
		storage: new StubStorage(),
		ledgerTransportFactory: async () => {},
	});

	await assert.rejects(
		() => env.verify({ profiles: [], data: {} }),
		'Terminating due to corrupted state: ValidationError: "profiles" must be of type object',
	);
});

test("should create a profile with password and persist", async () => {
	await makeSubject();

	const profile = subject.profiles().create("John Doe");
	profile.auth().setPassword("password");
	assert.not.throws(() => subject.persist());
});

test("should flush all bindings", async () => {
	container.constant("test", true);
	subject.reset();
	assert.throws(() => container.get("test"));
});

test("should flush all bindings and rebind them", async () => {
	await makeSubject();

	assert.not.throws(() => container.get(Identifiers.Storage));

	subject.reset({ coins: { ARK, BTC, ETH }, httpClient: new Request(), storage: new StubStorage() });

	assert.not.throws(() => container.get(Identifiers.Storage));
});

test.skip("should persist the env and restore it", async () => {
	// Create initial environment
	await makeSubject();

	const john = subject.profiles().create("John");
	await importByMnemonic(john, identity.mnemonic, "ARK", "ark.devnet");
	subject.profiles().persist(john);

	const jane = subject.profiles().create("Jane");
	jane.auth().setPassword("password");
	subject.profiles().persist(jane);

	const jack = subject.profiles().create("Jack");
	jack.auth().setPassword("password");
	subject.profiles().persist(jack);

	await subject.persist();

	// Boot new env after we persisted the data
	subject.reset({ coins: { ARK, BTC, ETH }, httpClient: new Request(), storage: new StubStorage() });
	await subject.verify();
	await subject.boot();

	// Assert that we got back what we dumped in the previous env
	const restoredJohn = subject.profiles().findById(john.id());
	await new ProfileImporter(restoredJohn).import();
	await restoredJohn.sync();

	const restoredJane = subject.profiles().findById(jane.id());
	await new ProfileImporter(restoredJane).import("password");
	await restoredJane.sync();

	const restoredJack = subject.profiles().findById(jack.id());
	await new ProfileImporter(restoredJack).import("password");
	await restoredJack.sync();

	assert.equal(new ProfileSerialiser(restoredJohn).toJSON(), new ProfileSerialiser(john).toJSON());
	assert.equal(new ProfileSerialiser(restoredJane).toJSON(), new ProfileSerialiser(jane).toJSON());
	assert.equal(new ProfileSerialiser(restoredJack).toJSON(), new ProfileSerialiser(jack).toJSON());
});

test.run();