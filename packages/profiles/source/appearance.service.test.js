import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { AppearanceService } from "./appearance.service";
import { Profile } from "./profile";
import { IProfile } from "./profile.contract";
import { ProfileSetting } from "./profile.enum.contract";

test.before(() => {
	bootContainer();
});

describe("AppearanceService", () => {
	let profile: IProfile;
	let subject: AppearanceService;

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
		assert.is(subject.defaults(), {
			accentColor: "green",
			dashboardTransactionHistory: true,
			theme: "light",
			useExpandedTables: false,
			useNetworkWalletNames: false,
		});
	});

	test("#all", async () => {
		assert.is(subject.all(), {
			accentColor: "blue",
			dashboardTransactionHistory: false,
			theme: "dark",
			useExpandedTables: true,
			useNetworkWalletNames: true,
		});
	});

	describe("#get", () => {
		test("should throw error if an unknown key is provided", () => {
			assert
				.is(() => subject.get("unknownKey" as any))
				.toThrow(
					'Parameter "key" must be one of: accentColor, dashboardTransactionHistory, theme, useExpandedTables, useNetworkWalletNames',
				);
		});

		test("should get setting value by key", () => {
			assert.is(subject.get("accentColor"), "blue");
			assert.is(subject.get("dashboardTransactionHistory"), false);
			assert.is(subject.get("theme"), "dark");
			assert.is(subject.get("useExpandedTables"), true);
			assert.is(subject.get("useNetworkWalletNames"), true);
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
	});
});
