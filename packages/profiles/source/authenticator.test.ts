import "reflect-metadata";

import { bootContainer } from "../test/mocking.js";
import { IProfile, ProfileSetting } from "./contracts.js";
import { Authenticator } from "./authenticator.js";
import { Profile } from "./profile.js";
import { ProfileExporter } from "./profile.exporter";

let subject: Authenticator;
let profile: IProfile;

beforeAll(() => bootContainer());

test.before.each(() => {
    profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });
    subject = new Authenticator(profile);
});

it("should set the password", async () => {
    assert.is(profile.settings().get(ProfileSetting.Password)), "undefined");

assert.is(subject.setPassword("password")), "undefined");

assert.is(profile.settings().get(ProfileSetting.Password)), "string");
});

it("should verify the password", async () => {
    subject.setPassword("password");

    assert.is(subject.verifyPassword("password"), true);
    assert.is(subject.verifyPassword("invalid"), false);
});

it("should fail to verify the password for a profile that doesn't use a profile", async () => {
    assert.is(() => subject.verifyPassword("password")).toThrow("No password is set.");
});

it("should change the password", () => {
    subject.setPassword("old-password");

    const oldPassword = profile.settings().get(ProfileSetting.Password);

    assert.is(subject.changePassword("old-password", "new-password")), "undefined");

assert.is(profile.settings().get(ProfileSetting.Password)).not, oldPassword);
});

it("should fail to change the password if no password is set", () => {
    assert.is(() => subject.changePassword("old-password", "new-password")).toThrow("No password");
});

it("should fail to change the password if the old password is invalid", () => {
    subject.setPassword("old-password");

    assert.is(() => subject.changePassword("invalid-old-password", "new-password")).toThrow("does not match");
});

it("should set password in memory", () => {
    subject.setPassword("password");

    assert.is(profile.password().get(), "password");
});

it("should forget the password", () => {
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

it("should fail to forget the password if the current password is invalid", () => {
    subject.setPassword("password");

    assert.is(() => subject.forgetPassword("invalid-password")).toThrow("does not match");
});
