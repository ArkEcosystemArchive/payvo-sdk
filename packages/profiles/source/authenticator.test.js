import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { ProfileSetting } from "./contracts";
import { Authenticator } from "./authenticator";
import { Profile } from "./profile";
import { ProfileExporter } from "./profile.exporter";

let subject;
let profile;

test.before(() => bootContainer());

test.before.each(() => {
	profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
	subject = new Authenticator(profile);
});

test("should set the password", async () => {
	assert.undefined(profile.settings().get(ProfileSetting.Password));

	assert.undefined(subject.setPassword("password"));

	assert.string(profile.settings().get(ProfileSetting.Password));
});

test("should verify the password", async () => {
	subject.setPassword("password");

	assert.true(subject.verifyPassword("password"));
	assert.false(subject.verifyPassword("invalid"));
});

test("should fail to verify the password for a profile that doesn't use a profile", async () => {
	assert.throws(() => subject.verifyPassword("password"), "No password is set.");
});

test("should change the password", () => {
	subject.setPassword("old-password");

	const oldPassword = profile.settings().get(ProfileSetting.Password);

	assert.undefined(subject.changePassword("old-password", "new-password"));

	assert.is.not(profile.settings().get(ProfileSetting.Password), oldPassword);
});

test("should fail to change the password if no password is set", () => {
	assert.throws(() => subject.changePassword("old-password", "new-password"), "No password");
});

test("should fail to change the password if the old password is invalid", () => {
	subject.setPassword("old-password");

	assert.throws(() => subject.changePassword("invalid-old-password", "new-password"), "does not match");
});

test("should set password in memory", () => {
	subject.setPassword("password");

	assert.is(profile.password().get(), "password");
});

test("should forget the password", () => {
	assert.false(profile.usesPassword());
	const firstExport = new ProfileExporter(profile).export();
	assert.string(firstExport);

	subject.setPassword("old-password");

	assert.true(profile.usesPassword());
	assert.true(new ProfileExporter(profile).export().length > firstExport.length * 2);

	subject.forgetPassword("old-password");

	assert.false(profile.usesPassword());
	assert.true(new ProfileExporter(profile).export().length <= firstExport.length);
});

test("should fail to forget the password if the current password is invalid", () => {
	subject.setPassword("password");

	assert.throws(() => subject.forgetPassword("invalid-password"), "does not match");
});

test.run();
