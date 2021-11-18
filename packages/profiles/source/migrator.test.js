import "reflect-metadata";

import { Base64 } from "@payvo/sdk-cryptography";

import { bootContainer } from "../test/mocking";
import { Migrator } from "./migrator";
import { Profile } from "./profile";
import { IProfile, ProfileData, ProfileSetting } from "./contracts";
import { ProfileImporter } from "./profile.importer";
import { ProfileSerialiser } from "./profile.serialiser";
import { IProfileData } from "./profile.contract";

let subject: Migrator;
let profile: IProfile;

test.before(() => bootContainer());

test.before.each(async () => {
	profile = new Profile({ id: "id", name: "name", avatar: "avatar", data: Base64.encode("{}") });

	subject = new Migrator(profile, {} as IProfileData);
});

test("should save the project version as the initial migrated version", async () => {
	await subject.migrate({}, "0.0.2");

	assert.is(profile.data().get(ProfileData.LatestMigration), "0.0.2");
});

test("should save the project version when a migration occurs", async () => {
	const migrations = {
		"0.0.3": async ({ profile }) => profile.data().set("key", "value"),
	};

	await subject.migrate(migrations, "0.0.2");
	assert.is(profile.data().get(ProfileData.LatestMigration), "0.0.2");

	await subject.migrate(migrations, "0.0.4");
	assert.is(profile.data().get(ProfileData.LatestMigration), "0.0.4");
	assert.is(profile.data().get("key"), "value");
});

test("should not run the migration when the version does not change", async () => {
	const migrations = {
		"1.0.0": async ({ profile }) => profile.data().set("key", "value"),
	};

	await subject.migrate(migrations, "0.0.2");
	assert.is(profile.data().get(ProfileData.LatestMigration), "0.0.2");
	assert.is(profile.data().has("key"), false);

	await subject.migrate(migrations, "0.0.2");
	assert.is(profile.data().get(ProfileData.LatestMigration), "0.0.2");
	assert.is(profile.data().has("key"), false);
});

test("should run migration when previous version is less but not zero", async () => {
	const migrations = {
		"0.0.3": async ({ profile }) => profile.data().set("key", "value"),
	};

	profile.data().get(ProfileData.LatestMigration, "0.0.1");
	await subject.migrate(migrations, "0.0.2");
	assert.is(profile.data().get(ProfileData.LatestMigration), "0.0.2");
});

test("should run the migration when the version changes", async () => {
	const migrations = {
		"1.0.0": async ({ profile }) => profile.data().set("key", "value"),
	};

	await subject.migrate(migrations, "0.0.2");
	assert.is(profile.data().get(ProfileData.LatestMigration), "0.0.2");
	assert.is(profile.data().has("key"), false);

	await subject.migrate(migrations, "1.1.0");
	assert.is(profile.data().get(ProfileData.LatestMigration), "1.1.0");
	assert.is(profile.data().has("key"), true);
	assert.is(profile.data().get("key"), "value");
});

test("should run the migration when the version uses semver comparisons", async () => {
	const migrations = {
		">=1.0": async ({ profile }) => profile.data().set("key", "value"),
	};

	await subject.migrate(migrations, "1.0.2");
	assert.is(profile.data().get(ProfileData.LatestMigration), "1.0.2");
	assert.is(profile.data().get("key"), "value");
});

test("should run the migration when the version uses multiple semver comparisons", async () => {
	const migrations = {
		">=1.0": async ({ profile }) => profile.data().set("key", "value"),
		">2.0.0": async ({ profile }) => profile.data().set("key", "new value"),
	};

	await subject.migrate(migrations, "1.0.2");
	assert.is(profile.data().get(ProfileData.LatestMigration), "1.0.2");
	assert.is(profile.data().get("key"), "value");

	await subject.migrate(migrations, "2.0.1");
	assert.is(profile.data().get(ProfileData.LatestMigration), "2.0.1");
	assert.is(profile.data().get("key"), "new value");
});

test("should run all valid migrations when the version uses multiple semver comparisons", async () => {
	const migrations = {
		">=1.0": async ({ profile }) => profile.data().set("key1", "value1"),
		">2.0.0": async ({ profile }) => {
			await profile.data().set("key2", "value2");
			await profile.data().set("key3", "value3");
		},
		"<3.0.0": async ({ profile }) => {
			await profile.data().set("key4", "value4");
			await profile.data().set("key5", "value5");
		},
	};

	await subject.migrate(migrations, "2.4.0");
	assert.is(profile.data().get(ProfileData.LatestMigration), "2.4.0");
	assert.is(profile.data().get("key1"), "value1");
	assert.is(profile.data().get("key2"), "value2");
	assert.is(profile.data().get("key3"), "value3");
	assert.is(profile.data().get("key4"), "value4");
	assert.is(profile.data().get("key5"), "value5");
});

test("should cleanup migrations with non-numeric values", async () => {
	const migrations = {
		"1.0.1-alpha": async ({ profile }) => profile.data().set("key1", "value1"),
		">2.0.0-beta": async ({ profile }) => {
			await profile.data().set("key2", "value2");
			await profile.data().set("key3", "value3");
		},
		"<3.0.0": async ({ profile }) => {
			await profile.data().set("key4", "value4");
			await profile.data().set("key5", "value5");
		},
	};

	await subject.migrate(migrations, "2.4.0");
	assert.is(profile.data().get(ProfileData.LatestMigration), "2.4.0");
	assert.is(profile.data().get("key1"), "value1");
	assert.is(profile.data().get("key2"), "value2");
	assert.is(profile.data().get("key3"), "value3");
	assert.is(profile.data().get("key4"), "value4");
	assert.is(profile.data().get("key5"), "value5");
});

test("should rollback changes if a migration failed", async () => {
	const failingMigrations = {
		"1.0.0": async ({ profile }) => profile.data().set("key", "initial update"),
		"1.0.1": async ({ profile }) => {
			await profile.data().set("key", "updated before crash");

			throw new Error("throw the migration and rollback");

			await profile.data().set("key", "unreachable");
		},
	};

	const passingMigrations = {
		"1.0.0": async ({ profile }) => profile.data().set("key", "initial update"),
	};

	await subject.migrate(passingMigrations, "1.0.0");

	await assert
		.is(subject.migrate(failingMigrations, "1.0.2"))
		.rejects.toThrowError(/throw the migration and rollback/);

	assert.is(profile.data().get(ProfileData.LatestMigration), "1.0.0");
	assert.is(profile.data().get("key"), "initial update");
});

test("should migrate profiles from JSON to Base64", async () => {
	profile = new Profile({
		id: "b999d134-7a24-481e-a95d-bc47c543bfc9",
		// @ts-ignore
		data: {
			contacts: {
				"0e147f96-049f-4d89-bad4-ad3341109907": {
					id: "0e147f96-049f-4d89-bad4-ad3341109907",
					name: "Jane Doe",
					starred: false,
					addresses: [
						{
							id: "403a2b1a-8f0a-4351-9e86-1e50da063de0",
							coin: "ARK",
							network: "ark.devnet",
							address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
						},
					],
				},
			},
			data: {
				key: "value",
			},
			exchangeTransactions: {},
			notifications: {
				"b183aef3-2dba-471a-a588-0fcf8f01b645": {
					id: "b183aef3-2dba-471a-a588-0fcf8f01b645",
					icon: "warning",
					name: "Ledger Update Available",
					body: "...",
					type: "type",
					action: "Read Changelog",
				},
			},
			plugins: {
				data: {},
			},
			settings: {
				[ProfileSetting.AccentColor]: "blue",
				[ProfileSetting.AdvancedMode]: false,
				[ProfileSetting.AutomaticSignOutPeriod]: 60,
				[ProfileSetting.Bip39Locale]: "english",
				[ProfileSetting.DashboardTransactionHistory]: false,
				[ProfileSetting.DoNotShowFeeWarning]: false,
				[ProfileSetting.ErrorReporting]: false,
				[ProfileSetting.ExchangeCurrency]: "ADA",
				[ProfileSetting.Locale]: "en-US",
				[ProfileSetting.MarketProvider]: "coingecko",
				[ProfileSetting.Name]: "John Doe",
				[ProfileSetting.NewsFilters]: JSON.stringify({ categories: [], coins: ["ARK"] }),
				[ProfileSetting.Password]: "$argon2id$v=19$m=16,t=2,p=1$S09reTl2S1NTVllrU2ZuMg$Efpf9GGOgXdDmFmW1eF1Ew",
				[ProfileSetting.ScreenshotProtection]: false,
				[ProfileSetting.Theme]: "dark",
				[ProfileSetting.TimeFormat]: "HH::MM",
				[ProfileSetting.UseExpandedTables]: false,
				[ProfileSetting.UseNetworkWalletNames]: false,
				[ProfileSetting.UseTestNetworks]: false,
			},
			wallets: {
				// Skip wallets for this test since we only care if the data was turned into base64, no need for network mocking.
			},
		},
	});

	subject = new Migrator(profile, {} as IProfileData);

	await subject.migrate(
		{
			"2.0.0": async ({ profile }: { profile: IProfile }) => {
				const profileData: Record<string, any> = profile.getAttributes().all();
				profileData.data.contacts["0e147f96-049f-4d89-bad4-ad3341109907"].name = "John Doe";
				profileData.data.contacts["0e147f96-049f-4d89-bad4-ad3341109907"].addresses = [
					{
						id: "403a2b1a-8f0a-4351-9e86-1e50da063de0",
						coin: "ARK",
						network: "ark.devnet",
						address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
					},
				];

				profile.getAttributes().setMany({
					id: profile.id(),
					name: profile.data.name,
					password: profileData.data.settings.PASSWORD,
					data: Base64.encode(JSON.stringify({ id: profile.id(), ...profileData.data })),
				});
			},
		},
		"2.0.0",
	);

	assert.is(profile.data().get(ProfileData.LatestMigration), "2.0.0");

	await new ProfileImporter(profile).import();

	assert.is(profile.id(), "b999d134-7a24-481e-a95d-bc47c543bfc9");
	assert.is(profile.usesPassword(), true);
	assert.is(profile.contacts().findById("0e147f96-049f-4d89-bad4-ad3341109907").name(), "John Doe");
	assert.is(new ProfileSerialiser(profile).toJSON()).toMatchInlineSnapshot(`
		Object {
		  "contacts": Object {
		    "0e147f96-049f-4d89-bad4-ad3341109907": Object {
		      "addresses": Array [
		        Object {
		          "address": "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
		          "coin": "ARK",
		          "id": "403a2b1a-8f0a-4351-9e86-1e50da063de0",
		          "network": "ark.devnet",
		        },
		      ],
		      "id": "0e147f96-049f-4d89-bad4-ad3341109907",
		      "name": "John Doe",
		      "starred": false,
		    },
		  },
		  "data": Object {
		    "LATEST_MIGRATION": "2.0.0",
		  },
		  "exchangeTransactions": Object {},
		  "id": "b999d134-7a24-481e-a95d-bc47c543bfc9",
		  "notifications": Object {
		    "b183aef3-2dba-471a-a588-0fcf8f01b645": Object {
		      "action": "Read Changelog",
		      "body": "...",
		      "icon": "warning",
		      "id": "b183aef3-2dba-471a-a588-0fcf8f01b645",
		      "name": "Ledger Update Available",
		      "type": "type",
		    },
		  },
		  "plugins": Object {},
		  "settings": Object {
		    "ACCENT_COLOR": "blue",
		    "ADVANCED_MODE": false,
		    "AUTOMATIC_SIGN_OUT_PERIOD": 60,
		    "BIP39_LOCALE": "english",
		    "DASHBOARD_TRANSACTION_HISTORY": false,
		    "DO_NOT_SHOW_FEE_WARNING": false,
		    "ERROR_REPORTING": false,
		    "EXCHANGE_CURRENCY": "ADA",
		    "LOCALE": "en-US",
		    "MARKET_PROVIDER": "coingecko",
		    "NAME": "John Doe",
		    "NEWS_FILTERS": "{\\"categories\\":[],\\"coins\\":[\\"ARK\\"]}",
		    "PASSWORD": "$argon2id$v=19$m=16,t=2,p=1$S09reTl2S1NTVllrU2ZuMg$Efpf9GGOgXdDmFmW1eF1Ew",
		    "SCREENSHOT_PROTECTION": false,
		    "THEME": "dark",
		    "TIME_FORMAT": "HH::MM",
		    "USE_EXPANDED_TABLES": false,
		    "USE_NETWORK_WALLET_NAMES": false,
		    "USE_TEST_NETWORKS": false,
		  },
		  "wallets": Object {},
		}
	`);
});
