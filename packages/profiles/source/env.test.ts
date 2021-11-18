import "reflect-metadata";

import { resolve } from "path";
import { Request } from "@payvo/sdk-http-fetch";
import { ARK } from "@payvo/sdk-ark";
import { BTC } from "@payvo/sdk-btc";
import { ETH } from "@payvo/sdk-eth";
import fs from "fs-extra";
import nock from "nock";

import storageData from "../test/fixtures/env-storage.json";
import { identity } from "../test/fixtures/identity.js";
import { importByMnemonic } from "../test/mocking.js";
import { StubStorage } from "../test/stubs/storage.js";
import { container } from "./container.js";
import { Identifiers } from "./container.models";
import { ProfileData } from "./contracts.js";
import { DataRepository } from "./data.repository";
import { Environment } from "./env.js";
import { ExchangeRateService } from "./exchange-rate.service.js";
import { MemoryStorage } from "./memory.storage";
import { PluginRegistry } from "./plugin-registry.service.js";
import { Profile } from "./profile.js";
import { ProfileImporter } from "./profile.importer";
import { ProfileRepository } from "./profile.repository";
import { ProfileSerialiser } from "./profile.serialiser";
import { WalletService } from "./wallet.service.js";

let subject: Environment;

const makeSubject = async (): Promise<void> => {
    subject = new Environment({
        coins: { ARK, BTC, ETH },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });
    await subject.verify();
    await subject.boot();
    await subject.persist();
};

beforeAll(() => {
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

beforeEach(async () => {
    fs.removeSync(resolve(__dirname, "../test/stubs/env.json"));

    container.flush();
});

it("should have a profile repository", async () => {
    await makeSubject();

    assert.is(subject.profiles() instanceof ProfileRepository);
});

it("should have a data repository", async () => {
    await makeSubject();

    assert.is(subject.data() instanceof DataRepository);
});

it("should have a plugin registry", async () => {
    await makeSubject();

    assert.is(subject.plugins() instanceof PluginRegistry);
});

it("should have available networks", async () => {
    await makeSubject();

    assert.is(subject.availableNetworks()).toHaveLength(14);

    for (const network of subject.availableNetworks()) {
        assert.is(network.toObject()).toMatchSnapshot();
    }
});

it("should set migrations", async () => {
    await makeSubject();

    assert.is(container.has(Identifiers.MigrationSchemas), false);
    assert.is(container.has(Identifiers.MigrationVersion), false);

    subject.setMigrations({}, "1.0.0");

    assert.is(container.has(Identifiers.MigrationSchemas), true);
    assert.is(container.has(Identifiers.MigrationVersion), true);
});

it("should create a profile with data and persist it when instructed to do so", async () => {
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
        ledgerTransportFactory: async () => { },
    });
    await newEnv.verify();
    await newEnv.boot();

    const newProfile = newEnv.profiles().findById(profile.id());

    assert.is(newProfile instanceof Profile);

    await new ProfileImporter(newProfile).import();
    await newProfile.sync();

    assert.is(newProfile.wallets().keys()).toHaveLength(1);
    assert.is(newProfile.contacts().keys()).toHaveLength(1);
    assert.is(newProfile.notifications().count(), 1);
    assert.is(newProfile.data().all()).toMatchInlineSnapshot(`
		Object {
		  "LATEST_MIGRATION": "0.0.0",
		}
	`);
    assert.is(newProfile.settings().all()).toMatchInlineSnapshot(`
		Object {
		  "ACCENT_COLOR": "green",
		  "ADVANCED_MODE": false,
		  "AUTOMATIC_SIGN_OUT_PERIOD": 15,
		  "BIP39_LOCALE": "english",
		  "DASHBOARD_TRANSACTION_HISTORY": true,
		  "DO_NOT_SHOW_FEE_WARNING": false,
		  "ERROR_REPORTING": false,
		  "EXCHANGE_CURRENCY": "BTC",
		  "LOCALE": "en-US",
		  "MARKET_PROVIDER": "cryptocompare",
		  "NAME": "John Doe",
		  "SCREENSHOT_PROTECTION": true,
		  "THEME": "light",
		  "TIME_FORMAT": "h:mm A",
		  "USE_EXPANDED_TABLES": false,
		  "USE_NETWORK_WALLET_NAMES": false,
		  "USE_TEST_NETWORKS": false,
		}
	`);
});

it("should boot the environment from fixed data", async () => {
    const env = new Environment({
        coins: { ARK },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });
    await env.verify(storageData);
    await env.boot();

    const newProfile = env.profiles().findById("8101538b-b13a-4b8d-b3d8-e710ccffd385");

    await new ProfileImporter(newProfile).import();

    assert.is(newProfile instanceof Profile);
    assert.is(newProfile.wallets().keys()).toHaveLength(1);
    assert.is(newProfile.contacts().keys()).toHaveLength(1);
    assert.is(newProfile.notifications().count(), 1);
    assert.is(newProfile.data().all()).toMatchInlineSnapshot(`
		Object {
		  "LATEST_MIGRATION": "0.0.0",
		}
	`);
    assert.is(newProfile.settings().all()).toEqual({
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
    assert.is(restoredWallet.settings().all()).toEqual({
        AVATAR: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" class="picasso" width="100" height="100" viewBox="0 0 100 100"><style>.picasso circle{mix-blend-mode:soft-light;}</style><rect fill="rgb(233, 30, 99)" width="100" height="100"/><circle r="50" cx="60" cy="40" fill="rgb(139, 195, 74)"/><circle r="45" cx="0" cy="30" fill="rgb(0, 188, 212)"/><circle r="40" cx="90" cy="50" fill="rgb(255, 193, 7)"/></svg>',
    });

    assert.is(restoredWallet.alias(), undefined);
});

it("should boot with empty storage data", async () => {
    const env = new Environment({
        coins: { ARK },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });

    await assert.is(env.verify({ profiles: storageData.profiles, data: {} })).resolves, "undefined");
await assert.is(env.boot()).resolves, "undefined");
});

it("should boot with empty storage profiles", async () => {
    const env = new Environment({
        coins: { ARK },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });

    await assert.is(env.verify({ profiles: {}, data: { key: "value" } })).resolves, "undefined");
await assert.is(env.boot()).resolves, "undefined");
});

it("should boot with exchange service data", async () => {
    const env = new Environment({
        coins: { ARK },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });

    await container.get<Storage>(Identifiers.Storage).set("EXCHANGE_RATE_SERVICE", {});

    await assert.is(env.verify({ profiles: {}, data: {} })).resolves, "undefined");
await assert.is(env.boot()).resolves, "undefined");
});

it("should create preselected storage given storage option as string", async () => {
    const env = new Environment({ coins: { ARK }, httpClient: new Request(), storage: "memory" });
    assert.is(container.get(Identifiers.Storage) instanceof MemoryStorage);
});

it("should throw error when calling boot without verify first", async () => {
    const env = new Environment({
        coins: { ARK },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });
    await assert.is(env.boot()).rejects.toThrowError("Please call [verify] before booting the environment.");
});

it("#exchangeRates", async () => {
    await makeSubject();

    assert.is(subject.exchangeRates() instanceof ExchangeRateService);
});

it("#fees", async () => {
    await makeSubject();

    await subject.fees().sync(subject.profiles().create("John"), "ARK", "ark.devnet");
    assert.is(Object.keys(subject.fees().all("ARK", "ark.devnet"))).toHaveLength(11);
});

it("#delegates", async () => {
    await makeSubject();

    await subject.delegates().sync(subject.profiles().create("John"), "ARK", "ark.devnet");
    assert.is(subject.delegates().all("ARK", "ark.devnet")).toHaveLength(200);
});

it("#knownWallets", async () => {
    await makeSubject();

    await subject.knownWallets().syncAll(subject.profiles().create("John Doe"));
    assert.is(subject.knownWallets().is("ark.devnet", "unknownWallet"), false);
});

it("#wallets", async () => {
    await makeSubject();

    assert.is(subject.wallets() instanceof WalletService);
});

it("should register a coin and deregister it", async () => {
    const env = new Environment({
        coins: { ARK },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });
    await env.verify(storageData);
    await env.boot();

    env.registerCoin("BTC", BTC);
    assert.is(() => env.registerCoin("BTC", BTC)).toThrowError(/is already registered/);
    assert.is(() => env.deregisterCoin("BTC")).not.toThrow();
});

it("should fail verification", async () => {
    const env = new Environment({
        coins: { ARK },
        httpClient: new Request(),
        storage: new StubStorage(),
        ledgerTransportFactory: async () => { },
    });

    // @ts-ignore
    await assert.is(env.verify({ profiles: [], data: {} })).rejects.toThrowError(
        'Terminating due to corrupted state: ValidationError: "profiles" must be of type object',
    );
});

it("should create a profile with password and persist", async () => {
    await makeSubject();

    const profile = subject.profiles().create("John Doe");
    profile.auth().setPassword("password");
    assert.is(() => subject.persist()).not.toThrowError();
});

it("should flush all bindings", async () => {
    container.constant("test", true);
    subject.reset();
    assert.is(() => container.get("test")).toThrow();
});

it("should flush all bindings and rebind them", async () => {
    await makeSubject();

    assert.is(() => container.get(Identifiers.Storage)).not.toThrow();

    subject.reset({ coins: { ARK, BTC, ETH }, httpClient: new Request(), storage: new StubStorage() });

    assert.is(() => container.get(Identifiers.Storage)).not.toThrow();
});

it("should persist the env and restore it", async () => {
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

    assert.is(new ProfileSerialiser(restoredJohn).toJSON()).toEqual(new ProfileSerialiser(john).toJSON());
    assert.is(new ProfileSerialiser(restoredJane).toJSON()).toEqual(new ProfileSerialiser(jane).toJSON());
    assert.is(new ProfileSerialiser(restoredJack).toJSON()).toEqual(new ProfileSerialiser(jack).toJSON());
});
