import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { nock } from "@payvo/sdk-test";

import { bootContainer } from "../test/mocking";
import { Profile } from "./profile";
import { IProfile, IProfileRepository } from "./contracts";
import { ProfileDumper } from "./profile.dumper";
import { Identifiers } from "./container.models";
import { container } from "./container";

let subject;
let profile;

test.before(() => {
	bootContainer();

	nock.disableNetConnect();

	nock.fake(/.+/)
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
	container.get(Identifiers.ProfileRepository).flush();

	profile = container.get(Identifiers.ProfileRepository).create("John Doe");
	subject = new ProfileDumper(profile);
});

test("should dump the profile with a password", () => {
	profile.auth().setPassword("password");

	const { id, password, data } = subject.dump();

	assert.string(id);
	assert.string(password);
	assert.string(data);
});

test("should dump the profile without a password", () => {
	const { id, password, data } = subject.dump();

	assert.string(id);
	assert.undefined(password);
	assert.string(data);
});

test("should fail to dump a profile with a password if the profile was not encrypted", () => {
	profile = new Profile({ id: "uuid", name: "name", data: "", password: "password" });
	subject = new ProfileDumper(profile);

	assert.throws(
		() => subject.dump(),
		"The profile [name] has not been encoded or encrypted. Please call [save] before dumping.",
	);
});

test.run();
