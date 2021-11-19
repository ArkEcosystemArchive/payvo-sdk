import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";
import nock from "nock";
import { bootContainer } from "../test/mocking";
import { PluginRepository } from "./plugin.repository";
import { ContactRepository } from "./contact.repository";
import { DataRepository } from "./data.repository";
import { ExchangeTransactionRepository } from "./exchange-transaction.repository";
import { SettingRepository } from "./setting.repository";
import { WalletRepository } from "./wallet.repository";
import { CountAggregate } from "./count.aggregate";
import { RegistrationAggregate } from "./registration.aggregate";
import { TransactionAggregate } from "./transaction.aggregate";
import { WalletAggregate } from "./wallet.aggregate";
import { Authenticator } from "./authenticator";
import { Profile } from "./profile";
import { IProfile, IReadWriteWallet, ProfileData, ProfileSetting } from "./contracts";
import { WalletFactory } from "./wallet.factory";
import { ProfileNotificationService } from "./notification.service";

let subject;

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
	subject = new Profile({ id: "uuid", name: "name", data: "" });

	subject.settings().set(ProfileSetting.Name, "John Doe");
});

test("should have an id", () => {
	assert.is(subject.id(), "uuid");
});

test("should have a name", () => {
	assert.is(subject.name(), "John Doe");
});

test("should have a default theme", () => {
	assert.is(subject.appearance().get("theme"), "light");
});

test("should have a custom theme", () => {
	subject.settings().set(ProfileSetting.Theme, "dark");

	assert.is(subject.appearance().get("theme"), "dark");
});

test("should have a default avatar", () => {
	assert.string(subject.avatar());
});

test("should have a custom avatar", () => {
	subject.settings().set(ProfileSetting.Avatar, "custom-avatar");

	assert.is(subject.avatar(), "custom-avatar");
});

test("should have a custom avatar in data", () => {
	subject.getAttributes().set("data.avatar", "something");
	subject.getAttributes().set("avatar", "custom-avatar");

	assert.is(subject.avatar(), "custom-avatar");
});

test("should have a balance", () => {
	assert.is(subject.balance(), 0);
});

test("should have a converted balance", () => {
	assert.is(subject.convertedBalance(), 0);
});

test("should have a contacts repository", () => {
	assert.instance(subject.contacts(), ContactRepository);
});

test("should have a data repository", () => {
	assert.instance(subject.data(), DataRepository);
});

test("should have a exchange transactions repository", () => {
	assert.instance(subject.exchangeTransactions(), ExchangeTransactionRepository);
});

test("should have a notifications repository", () => {
	assert.instance(subject.notifications(), ProfileNotificationService);
});

test("should have a plugins repository", () => {
	assert.instance(subject.plugins(), PluginRepository);
});

test("should have a settings repository", () => {
	assert.instance(subject.settings(), SettingRepository);
});

test("should have a wallets repository", () => {
	assert.instance(subject.wallets(), WalletRepository);
});

test("should flush all data", () => {
	assert.length(subject.settings().keys(), 1);

	subject.flush();

	assert.length(subject.settings().keys(), 17);
});

test("should fail to flush all data if the name is missing", () => {
	subject.settings().forget(ProfileSetting.Name);

	assert.length(subject.settings().keys(), 0);

	assert.throws(() => subject.flush(), "The name of the profile could not be found. This looks like a bug.");
});

test("should flush settings", () => {
	assert.length(subject.settings().keys(), 1);

	subject.flushSettings();

	assert.length(subject.settings().keys(), 17);
});

test("should fail to flush settings if the name is missing", () => {
	subject.settings().forget(ProfileSetting.Name);

	assert.length(subject.settings().keys(), 0);

	assert
		.is(() => subject.flushSettings())
		.toThrowError("The name of the profile could not be found. This looks like a bug.");
});

test("should have a a wallet factory", () => {
	assert.instance(subject.walletFactory(), WalletFactory);
});

test("should have a count aggregate", () => {
	assert.instance(subject.countAggregate(), CountAggregate);
});

test("should have a registration aggregate", () => {
	assert.instance(subject.registrationAggregate(), RegistrationAggregate);
});

test("should have a transaction aggregate", () => {
	assert.instance(subject.transactionAggregate(), TransactionAggregate);
});

test("should have a wallet aggregate", () => {
	assert.instance(subject.walletAggregate(), WalletAggregate);
});

test("should have an authenticator", () => {
	assert.instance(subject.auth(), Authenticator);
});

test("should determine if the password uses a password", () => {
	assert.false(subject.usesPassword());

	subject.auth().setPassword("password");

	assert.true(subject.usesPassword());
});

test("#hasBeenPartiallyRestored", async () => {
	const wallet = sinon.spy();
	wallet.id.mockReturnValue("some-id");
	wallet.hasBeenPartiallyRestored.mockReturnValue(true);
	subject.wallets().push(wallet);
	assert.true(subject.hasBeenPartiallyRestored());
});

test("should mark the introductory tutorial as completed", () => {
	assert.false(subject.hasCompletedIntroductoryTutorial());

	subject.markIntroductoryTutorialAsComplete();

	assert.true(subject.hasCompletedIntroductoryTutorial());
});

test("should determine if the introductory tutorial has been completed", () => {
	assert.false(subject.hasCompletedIntroductoryTutorial());

	subject.data().set(ProfileData.HasCompletedIntroductoryTutorial, true);

	assert.true(subject.hasCompletedIntroductoryTutorial());
});

test("should mark the manual installation disclaimer as accepted", () => {
	assert.false(subject.hasAcceptedManualInstallationDisclaimer());

	subject.markManualInstallationDisclaimerAsAccepted();

	assert.true(subject.hasAcceptedManualInstallationDisclaimer());
});

test("should determine if the manual installation disclaimer has been accepted", () => {
	assert.false(subject.hasAcceptedManualInstallationDisclaimer());

	subject.data().set(ProfileData.HasAcceptedManualInstallationDisclaimer, true);

	assert.true(subject.hasAcceptedManualInstallationDisclaimer());
});

// test("should fail to encrypt a profile if the password is invalid", () => {
// 	subject.auth().setPassword("password");

// 	assert.throws(() => subject.save("invalid-password"), "The password did not match our records.");
// });

// test("should encrypt a profile with the in-memory password if none was provided", () => {
// 	subject.auth().setPassword("password");

// 	assert.not.throws(() => subject.save(), "The password did not match our records.");
// });

// test("should fail to save if encoding or encrypting fails", () => {
// 	// @ts-ignore
// 	const encodingMock = mockery(JSON, "stringify").mockReturnValue(undefined);

// 	assert.throws(() => subject.save(), "Failed to encode or encrypt the profile");
// 	encodingMock.mockRestore();
// });

test.run();
