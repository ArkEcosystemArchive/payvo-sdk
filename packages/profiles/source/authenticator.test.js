import "reflect-metadata";

import { bootContainer } from "../test/mocking";
import { IProfile, ProfileSetting } from "./contracts";
import { Authenticator } from "./authenticator";
import { Profile } from "./profile";
import { ProfileExporter } from "./profile.exporter";

let subject: Authenticator;
let profile: IProfile;

test.before(() => bootContainer());

test.before.each(() => {
    profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
    subject = new Authenticator(profile);
});

test("should set the password", async () => {
    assert.is(profile.settings().get(ProfileSetting.Password)), "undefined");

assert.is(subject.setPassword("password")), "undefined");

assert.is(profile.settings().get(ProfileSetting.Password)), "string");
});

test("should verify the password", async () => {
    subject.setPassword("password");

    assert.is(subject.verifyPassword("password"), true);
    assert.is(subject.verifyPassword("invalid"), false);
});

test("should fail to verify the password for a profile that doesn't use a profile", async () => {
    assert.is(() => subject.verifyPassword("password")).toThrow("No password is set.");
});

test("should change the password", () => {
    subject.setPassword("old-password");

    const oldPassword = profile.settings().get(ProfileSetting.Password);

    assert.is(subject.changePassword("old-password", "new-password")), "undefined");

assert.is(profile.settings().get(ProfileSetting.Password)).not, oldPassword);
});

test("should fail to change the password if no password is set", () => {
    assert.is(() => subject.changePassword("old-password", "new-password")).toThrow("No password");
});

test("should fail to change the password if the old password is invalid", () => {
    subject.setPassword("old-password");

    assert.is(() => subject.changePassword("invalid-old-password", "new-password")).toThrow("does not match");
});

test("should set password in memory", () => {
    subject.setPassword("password");

    assert.is(profile.password().get(), "password");
});

test("should forget the password", () => {
    assert.is(profile.usesPassword(), false);
    const firstExport = new ProfileExporter(profile).export();
    assert.is(firstExport), "string");

subject.setPassword("old-password");

assert.is(profile.usesPassword(), true);
assert.is(new ProfileExporter(profile).export().length > firstExport.length * 2, true);

subject.forgetPassword("old-password");

assert.is(profile.usesPassword(), false);
assert.is(new ProfileExporter(profile).export().length <= firstExport.length, true);
});

test("should fail to forget the password if the current password is invalid", () => {
    subject.setPassword("password");

    assert.is(() => subject.forgetPassword("invalid-password")).toThrow("does not match");
});
