import { assert, describe, sinon, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { Base64 } from "@payvo/sdk-cryptography";
import nock from "nock";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { Profile } from "./profile";
import { ProfileSetting } from "./contracts";
import { ProfileImporter } from "./profile.importer";
import { ProfileDumper } from "./profile.dumper";
import { ProfileSerialiser } from "./profile.serialiser";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ProfileRepository } from "./profile.repository";

let subject;
let dumper;
let serialiser;
let repository;
let profile;

const profileWithWallets = {
	id: "uuid",
	contacts: {
		"448042c3-a405-4895-970e-a33c6e907905": {
			id: "448042c3-a405-4895-970e-a33c6e907905",
			name: "John",
			starred: false,
			addresses: [
				{
					id: "3a7a9e03-c10b-4135-88e9-92e586d53e69",
					coin: "ARK",
					network: "ark.devnet",
					address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
				},
			],
		},
	},
	data: { key: "value" },
	exchangeTransactions: {},
	notifications: {},
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
		[ProfileSetting.ScreenshotProtection]: false,
		[ProfileSetting.Theme]: "dark",
		[ProfileSetting.TimeFormat]: "HH::MM",
		[ProfileSetting.UseExpandedTables]: false,
		[ProfileSetting.UseNetworkWalletNames]: false,
		[ProfileSetting.UseTestNetworks]: false,
	},
	wallets: {
		"88ff9e53-7d40-420d-8f39-9f24acee2164": {
			id: "88ff9e53-7d40-420d-8f39-9f24acee2164",
			data: {
				COIN: "ARK",
				NETWORK: "ark.devnet",
				ADDRESS: "D6Z26L69gdk9qYmTv5uzk3uGepigtHY4ax",
				PUBLIC_KEY: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
				BALANCE: {},
				SEQUENCE: {},
			},
			settings: {
				AVATAR: "...",
			},
		},
		"ac38fe6d-4b67-4ef1-85be-17c5f6841129": {
			id: "ac38fe6d-4b67-4ef1-85be-17c5f6841129",
			data: {
				COIN: "ARK",
				NETWORK: "ark.devnet",
				ADDRESS: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
				PUBLIC_KEY: "030fde54605c5d53436217a2849d276376d0b0f12c71219cd62b0a4539e1e75acd",
				BALANCE: {},
				SEQUENCE: {},
			},
			settings: {
				ALIAS: "Johnathan Doe",
				AVATAR: "...",
			},
		},
	},
};

test.before(() => {
	bootContainer();

	nock.disableNetConnect();

	nock(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet.json"))
		.get("/api/wallets/DNc92FQmYu8G9Xvo6YqhPtRxYsUxdsUn9w")
		.reply(200, require("../test/fixtures/client/wallet-2.json"))
		.persist();
});

test.before.each(() => {
	container.get(Identifiers.ProfileRepository).flush();

	profile = container.get(Identifiers.ProfileRepository).create("John Doe");
	subject = new ProfileImporter(profile);
	dumper = new ProfileDumper(profile);
	serialiser = new ProfileSerialiser(profile);
	repository = new ProfileRepository();
});

describe("#restore", () => {
	test("should restore a profile with a password", async () => {
		profile.auth().setPassword("password");

		repository.persist(profile);

		const profileCopy = new Profile(dumper.dump());

		await importByMnemonic(profileCopy, identity.mnemonic, "ARK", "ark.devnet");

		serialiser = new ProfileSerialiser(profileCopy);

		await subject.import("password");
		await profileCopy.sync();

		assert.containKeys(serialiser.toJSON(), [
			"contacts",
			"data",
			"exchangeTransactions",
			"notifications",
			"plugins",
			"data",
			"settings",
			"wallets",
		]);
	});

	test("should fail to restore a profile with corrupted data", async () => {
		const corruptedProfileData = {
			// id: 'uuid',
			contacts: {},
			data: {},
			exchangeTransactions: {},
			notifications: {},
			plugins: { data: {} },
			settings: { NAME: "John Doe" },
			wallets: {},
		};

		const profile = new Profile({
			id: "uuid",
			name: "name",
			avatar: "avatar",
			password: undefined,
			data: Base64.encode(JSON.stringify(corruptedProfileData)),
		});

		subject = new ProfileImporter(profile);

		await assert.rejects(() => subject.import());
	});

	test("should restore a profile without a password", async () => {
		const profileCopy = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await subject.import();

		assert.equal(new ProfileSerialiser(profile).toJSON(), new ProfileSerialiser(profileCopy).toJSON());
	});

	test("should fail to restore if profile is not using password but password is passed", async () => {
		const profileCopy = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await assert.rejects(
			() => subject.import("password"),
			"Failed to decode or decrypt the profile. Reason: This profile does not use a password but password was passed for decryption",
		);
	});

	test("should fail to restore a profile with a password if no password was provided", async () => {
		profile.auth().setPassword("password");

		repository.persist(profile);

		const profileCopy = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await assert.rejects(() => subject.import(), "Failed to decode or decrypt the profile.");
	});

	test("should fail to restore a profile with a password if an invalid password was provided", async () => {
		profile.auth().setPassword("password");

		const profileCopy = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await assert.rejects(() => subject.import("invalid-password"), "Failed to decode or decrypt the profile.");
	});

	test("should restore a profile with wallets and contacts", async () => {
		const profileDump = {
			id: "uuid",
			name: "name",
			avatar: "avatar",
			password: undefined,
			data: Base64.encode(JSON.stringify(profileWithWallets)),
		};

		const profile = new Profile(profileDump);
		subject = new ProfileImporter(profile);
		await subject.import();

		assert.is(profile.wallets().values().length, 2);
		assert.is(profile.wallets().valuesWithCoin().length, 2);
		assert.is(profile.contacts().count(), 1);
		assert.is(profile.contacts().first().addresses().count(), 1);
		assert.is(profile.settings().get(ProfileSetting.AccentColor), "blue");
		assert.is(profile.settings().get(ProfileSetting.Theme), "dark");
	});

	test("should restore a profile with wallets of unavailable coins", async () => {
		const profileDump = {
			id: "uuid",
			name: "name",
			avatar: "avatar",
			password: undefined,
			data: Base64.encode(JSON.stringify(profileWithWallets)),
		};

		const coin = container.get(Identifiers.Coins)["ARK"];
		delete container.get(Identifiers.Coins)["ARK"];

		const profile = new Profile(profileDump);
		subject = new ProfileImporter(profile);
		await subject.import();

		assert.is(profile.wallets().values().length, 2);
		assert.is(profile.wallets().valuesWithCoin().length, 0);

		assert.is(profile.contacts().count(), 1);
		assert.is(profile.contacts().first().addresses().count(), 1);
		assert.is(profile.settings().get(ProfileSetting.AccentColor), "blue");
		assert.is(profile.settings().get(ProfileSetting.Theme), "dark");

		container.get(Identifiers.Coins)["ARK"] = coin;
	});

	test("should apply migrations if any are set", async () => {
		const migrationFunction = sinon.spy();
		const migrations = { "1.0.1": migrationFunction };

		container.constant(Identifiers.MigrationSchemas, migrations);
		container.constant(Identifiers.MigrationVersion, "1.0.2");

		subject = new ProfileImporter(new Profile(dumper.dump()));

		await subject.import();

		assert.true(migrationFunction.callCount > 0);
	});
});

test.run();
