import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { Base64 } from "@payvo/sdk-cryptography";
import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";
import { IProfile } from "./contracts";

let profile;

test.before(() => bootContainer());

test.before.each(async () => {
	profile = new Profile({ id: "id", name: "name", avatar: "avatar", data: Base64.encode("{}") });
});

test("should mark the profile as dirty", async () => {
	assert.false(profile.status().isDirty());
	profile.status().markAsDirty();
	assert.true(profile.status().isDirty());
});

test("should mark the profile as restored", async () => {
	assert.false(profile.status().isRestored());
	profile.status().markAsRestored();
	assert.true(profile.status().isRestored());
});

test("should reset the status of the profile to the default values", async () => {
	profile.status().markAsRestored();
	assert.true(profile.status().isRestored());
	profile.status().reset();
	assert.false(profile.status().isRestored());
});

test("should reset dirty status", async () => {
	profile.status().markAsDirty();
	assert.true(profile.status().isDirty());
	profile.status().markAsClean();
	assert.false(profile.status().isDirty());
});

test.run();
