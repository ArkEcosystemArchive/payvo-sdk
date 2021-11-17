import { Coins } from "@payvo/sdk";
import "reflect-metadata";

import { Base64 } from "@payvo/sdk-cryptography";
import nock from "nock";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer, importByMnemonic } from "../test/mocking.js";
import { Profile } from "./profile.js";
import { IProfile, IProfileRepository, ProfileSetting } from "./contracts.js";
import { ProfileImporter } from "./profile.importer";
import { ProfileDumper } from "./profile.dumper";
import { ProfileSerialiser } from "./profile.serialiser";
import { container } from "./container.js";
import { Identifiers } from "./container.models";
import { ProfileRepository } from "./profile.repository";

let subject: ProfileImporter;
let dumper: ProfileDumper;
let serialiser: ProfileSerialiser;
let repository: ProfileRepository;
let profile: IProfile;

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

beforeAll(() => {
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

beforeEach(() => {
	container.get<IProfileRepository>(Identifiers.ProfileRepository).flush();

	profile = container.get<IProfileRepository>(Identifiers.ProfileRepository).create("John Doe");
	subject = new ProfileImporter(profile);
	dumper = new ProfileDumper(profile);
	serialiser = new ProfileSerialiser(profile);
	repository = new ProfileRepository();
});

describe("#restore", () => {
	it("should restore a profile with a password", async () => {
		profile.auth().setPassword("password");

		repository.persist(profile);

		const profileCopy: IProfile = new Profile(dumper.dump());

		await importByMnemonic(profileCopy, identity.mnemonic, "ARK", "ark.devnet");

		serialiser = new ProfileSerialiser(profileCopy);

		await subject.import("password");
		await profileCopy.sync();

		expect(serialiser.toJSON()).toContainAllKeys([
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

	it("should fail to restore a profile with corrupted data", async () => {
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

		const profile: IProfile = new Profile({
			id: "uuid",
			name: "name",
			avatar: "avatar",
			password: undefined,
			data: Base64.encode(JSON.stringify(corruptedProfileData)),
		});

		subject = new ProfileImporter(profile);

		await expect(subject.import()).rejects.toThrow();
	});

	it("should restore a profile without a password", async () => {
		const profileCopy: IProfile = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await subject.import();

		expect(new ProfileSerialiser(profile).toJSON()).toEqual(new ProfileSerialiser(profileCopy).toJSON());
	});

	it("should fail to restore if profile is not using password but password is passed", async () => {
		const profileCopy: IProfile = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await expect(subject.import("password")).rejects.toThrow(
			"Failed to decode or decrypt the profile. Reason: This profile does not use a password but password was passed for decryption",
		);
	});

	it("should fail to restore a profile with a password if no password was provided", async () => {
		profile.auth().setPassword("password");

		repository.persist(profile);

		const profileCopy: IProfile = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await expect(subject.import()).rejects.toThrow("Failed to decode or decrypt the profile.");
	});

	it("should fail to restore a profile with a password if an invalid password was provided", async () => {
		profile.auth().setPassword("password");

		const profileCopy: IProfile = new Profile(dumper.dump());

		subject = new ProfileImporter(profileCopy);

		await expect(subject.import("invalid-password")).rejects.toThrow("Failed to decode or decrypt the profile.");
	});

	it("should restore a profile with wallets and contacts", async () => {
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

		expect(profile.wallets().values().length).toEqual(2);
		expect(profile.wallets().valuesWithCoin().length).toEqual(2);
		expect(profile.contacts().count()).toEqual(1);
		expect(profile.contacts().first().addresses().count()).toEqual(1);
		expect(profile.settings().get(ProfileSetting.AccentColor)).toEqual("blue");
		expect(profile.settings().get(ProfileSetting.Theme)).toEqual("dark");
	});

	it("should restore a profile with wallets of unavailable coins", async () => {
		const profileDump = {
			id: "uuid",
			name: "name",
			avatar: "avatar",
			password: undefined,
			data: Base64.encode(JSON.stringify(profileWithWallets)),
		};

		const coin = container.get<Coins.CoinBundle>(Identifiers.Coins)["ARK"];
		delete container.get<Coins.CoinBundle>(Identifiers.Coins)["ARK"];

		const profile = new Profile(profileDump);
		subject = new ProfileImporter(profile);
		await subject.import();

		expect(profile.wallets().values().length).toEqual(2);
		expect(profile.wallets().valuesWithCoin().length).toEqual(0);

		expect(profile.contacts().count()).toEqual(1);
		expect(profile.contacts().first().addresses().count()).toEqual(1);
		expect(profile.settings().get(ProfileSetting.AccentColor)).toEqual("blue");
		expect(profile.settings().get(ProfileSetting.Theme)).toEqual("dark");

		container.get<Coins.CoinBundle>(Identifiers.Coins)["ARK"] = coin;
	});

	it("should apply migrations if any are set", async () => {
		const migrationFunction = jest.fn();
		const migrations = { "1.0.1": migrationFunction };

		container.constant(Identifiers.MigrationSchemas, migrations);
		container.constant(Identifiers.MigrationVersion, "1.0.2");

		subject = new ProfileImporter(new Profile(dumper.dump()));

		await subject.import();

		expect(migrationFunction).toHaveBeenCalled();
	});
});
