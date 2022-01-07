import { describe } from "@payvo/sdk-test";

import { bootContainer } from "../test/mocking";
import { AppearanceService } from "./appearance.service.js";
import { Profile } from "./profile";
import { ProfileSetting } from "./profile.enum.contract";

describe("AppearanceService", async ({ beforeEach, it, assert }) => {
	beforeEach((context) => {
		bootContainer();

		context.profile = new Profile({
			appearance: {
				accentColor: "blue",
				dashboardTransactionHistory: false,
				theme: "dark",
				useExpandedTables: true,
				useNetworkWalletNames: true,
			},
			avatar: "avatar",
			data: "",
			id: "uuid",
			name: "name",
		});

		context.subject = new AppearanceService(context.profile);
	});

	it("#defaults", async (context) => {
		assert.equal(context.subject.defaults(), {
			accentColor: "green",
			dashboardTransactionHistory: false,
			theme: "light",
			useExpandedTables: false,
			useNetworkWalletNames: false,
		});
	});

	it("#all", async (context) => {
		assert.equal(context.subject.all(), {
			accentColor: "blue",
			dashboardTransactionHistory: false,
			theme: "dark",
			useExpandedTables: true,
			useNetworkWalletNames: true,
		});
	});

	it("should throw error if an unknown key is provided", (context) => {
		assert.throws(
			() => context.subject.get("unknownKey"),
			'Parameter "key" must be one of: accentColor, dashboardTransactionHistory, theme, useExpandedTables, useNetworkWalletNames',
		);
	});

	it("should get setting value by key", (context) => {
		assert.is(context.subject.get("accentColor"), "blue");
		assert.false(context.subject.get("dashboardTransactionHistory"));
		assert.is(context.subject.get("theme"), "dark");
		assert.true(context.subject.get("useExpandedTables"));
		assert.true(context.subject.get("useNetworkWalletNames"));
	});

	it("should prioritize settings over attributes", (context) => {
		context.profile.settings().set(ProfileSetting.Theme, "light");
		assert.is(context.subject.get("theme"), "light");
	});

	it("should return default value if both settings and attributes are missing", (context) => {
		context.profile.settings().forget(ProfileSetting.Theme);
		delete context.profile.getAttributes().get("appearance").theme;

		assert.is(context.subject.get("theme"), context.subject.defaults().theme);
	});
});
