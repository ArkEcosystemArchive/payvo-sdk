import { assert, Mockery, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { Base64 } from "@payvo/sdk-cryptography";
import nock from "nock";

import { bootContainer } from "../test/mocking";
import { container } from "./container";
import { Identifiers } from "./container.models";
import { ProfileSetting } from "./contracts";
import { Profile } from "./profile";
import { ProfileDumper } from "./profile.dumper";
import { ProfileImporter } from "./profile.importer";
import { ProfileValidator } from "./profile.validator";

let subject;
let validator;
let dumper;
let profile;

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
	validator = new ProfileValidator();
	dumper = new ProfileDumper(profile);
});

test("should successfully validate profile data", async () => {
	const validProfileData = {
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
						address: "test",
					},
					{
						id: "dfc3a16d-47b8-47f2-9b6f-fe4b8365a64a",
						coin: "ARK",
						network: "ark.mainnet",
						address: "test",
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
		wallets: {},
	};

	validator = new ProfileValidator();

	assert.equal(validator.validate(validProfileData).settings, validProfileData.settings);
});

test("should fail to validate", async () => {
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

	new Profile({
		id: "uuid",
		name: "name",
		avatar: "avatar",
		password: undefined,
		data: Base64.encode(JSON.stringify(corruptedProfileData)),
	});

	validator = new ProfileValidator();

	assert.throws(() => validator.validate(corruptedProfileData));
});

test("should apply migrations if any are set", async () => {
	const migrationFunction = Mockery.spy();
	const migrations = { "1.0.1": migrationFunction };

	container.constant(Identifiers.MigrationSchemas, migrations);
	container.constant(Identifiers.MigrationVersion, "1.0.2");

	subject = new ProfileImporter(new Profile(dumper.dump()));

	await subject.import();

	assert.true(migrationFunction.callCount > 0);
});

test.run();
