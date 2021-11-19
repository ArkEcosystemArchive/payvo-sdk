import { assert, describe, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { AppearanceService } from "./appearance.service";
import { Profile } from "./profile";
import { ProfileSetting } from "./profile.enum.contract";

test.before(() => {
	bootContainer();
});

let profile;
let subject;

test.before.each(() => {
	profile = new Profile({
		id: "uuid",
		name: "name",
		avatar: "avatar",
		data: "",
		appearance: {
			accentColor: "blue",
			dashboardTransactionHistory: false,
			theme: "dark",
			useExpandedTables: true,
			useNetworkWalletNames: true,
		},
	});

	subject = new AppearanceService(profile);
});

test("#defaults", async () => {
	assert.equal(subject.defaults(), {
		accentColor: "green",
		dashboardTransactionHistory: true,
		theme: "light",
		useExpandedTables: false,
		useNetworkWalletNames: false,
	});
});

test("#all", async () => {
	assert.equal(subject.all(), {
		accentColor: "blue",
		dashboardTransactionHistory: false,
		theme: "dark",
		useExpandedTables: true,
		useNetworkWalletNames: true,
	});
});

test("should throw error if an unknown key is provided", () => {
	assert.throws(
		() => subject.get("unknownKey"),
		'Parameter "key" must be one of: accentColor, dashboardTransactionHistory, theme, useExpandedTables, useNetworkWalletNames',
	);
});

test("should get setting value by key", () => {
	assert.is(subject.get("accentColor"), "blue");
	assert.false(subject.get("dashboardTransactionHistory"));
	assert.is(subject.get("theme"), "dark");
	assert.true(subject.get("useExpandedTables"));
	assert.true(subject.get("useNetworkWalletNames"));
});

test("should prioritize settings over attributes", () => {
	profile.settings().set(ProfileSetting.Theme, "light");
	assert.is(subject.get("theme"), "light");
});

test("should return default value if both settings and attributes are missing", () => {
	profile.settings().forget(ProfileSetting.Theme);
	delete profile.getAttributes().get("appearance").theme;

	assert.is(subject.get("theme"), subject.defaults().theme);
});

test.run();
