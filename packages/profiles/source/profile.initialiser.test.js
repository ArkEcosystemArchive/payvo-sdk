import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { Profile } from "./profile";
import { IProfile, ProfileSetting, ProfileData } from "./contracts";
import { ProfileInitialiser } from "./profile.initialiser";
import { bootContainer } from "../test/mocking";
import nock from "nock";

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

describe("ProfileInitialiser", ({ afterEach, beforeEach, test }) => {
	let profile;

	test.before.each(() => {
		profile = new Profile({ id: "uuid", name: "name", data: "" });
	});

	test("should flush service data", () => {
		profile.contacts().create("test", [
			{
				coin: "ARK",
				network: "ark.devnet",
				address: "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW",
			},
		]);
		profile.data().set(ProfileData.HasCompletedIntroductoryTutorial, true);
		profile.settings().set(ProfileSetting.Theme, "dark");

		assert.is(profile.contacts().count(), 1);
		assert.true(profile.data().get(ProfileData.HasCompletedIntroductoryTutorial));
		assert.is(profile.settings().get(ProfileSetting.Theme), "dark");

		new ProfileInitialiser(profile).initialise("name");

		assert.is(profile.contacts().count(), 0);
		assert.undefined(profile.data().get(ProfileData.HasCompletedIntroductoryTutorial));
		assert.is(profile.settings().get(ProfileSetting.Theme), "light");
	});

	test("should initialise the default settings", () => {
		assert.undefined(profile.settings().get(ProfileSetting.Name));
		assert.undefined(profile.settings().get(ProfileSetting.AccentColor));
		assert.undefined(profile.settings().get(ProfileSetting.Theme));

		new ProfileInitialiser(profile).initialiseSettings("name");

		assert.is(profile.settings().get(ProfileSetting.Name), "name");
		assert.is(profile.settings().get(ProfileSetting.AccentColor), "green");
		assert.is(profile.settings().get(ProfileSetting.Theme), "light");
	});
});

test.run();
