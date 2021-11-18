import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { AppearanceService } from "./appearance.service.js";
import { Profile } from "./profile.js";
import { IProfile } from "./profile.contract.js";
import { ProfileSetting } from "./profile.enum.contract.js";

beforeAll(() => {
	bootContainer();
});

describe("AppearanceService", () => {
	let profile: IProfile;
	let subject: AppearanceService;

	beforeEach(() => {
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
		assert.is(subject.defaults()).toEqual({
			accentColor: "green",
			dashboardTransactionHistory: true,
			theme: "light",
			useExpandedTables: false,
			useNetworkWalletNames: false,
		});
	});

	test("#all", async () => {
		assert.is(subject.all()).toEqual({
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
