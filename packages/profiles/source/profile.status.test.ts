import "reflect-metadata";

import { Base64 } from "@payvo/sdk-cryptography";
import { bootContainer } from "../test/mocking.js";
import { Profile } from "./profile.js";
import { IProfile } from "./contracts.js";

let profile: IProfile;

beforeAll(() => bootContainer());

test.before.each(async () => {
	profile = new Profile({ id: "id", name: "name", avatar: "avatar", data: Base64.encode("{}") });
});

it("should mark the profile as dirty", async () => {
	assert.is(profile.status().isDirty(), false);
	profile.status().markAsDirty();
	assert.is(profile.status().isDirty(), true);
});

it("should mark the profile as restored", async () => {
	assert.is(profile.status().isRestored(), false);
	profile.status().markAsRestored();
	assert.is(profile.status().isRestored(), true);
});

it("should reset the status of the profile to the default values", async () => {
	profile.status().markAsRestored();
	assert.is(profile.status().isRestored(), true);
	profile.status().reset();
	assert.is(profile.status().isRestored(), false);
});

it("should reset dirty status", async () => {
	profile.status().markAsDirty();
	assert.is(profile.status().isDirty(), true);
	profile.status().markAsClean();
	assert.is(profile.status().isDirty(), false);
});
