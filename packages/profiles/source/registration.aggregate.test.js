import { assert, describe, Mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import {nock} from "@payvo/sdk-test";

import { identity } from "../test/fixtures/identity";
import { bootContainer, importByMnemonic } from "../test/mocking";
import { IProfile } from "./contracts";
import { Profile } from "./profile";
import { RegistrationAggregate } from "./registration.aggregate";

let subject;
let profile;

test.before(() => {
	bootContainer();

	nock.fake(/.+/)
		.get("/api/node/configuration/crypto")
		.reply(200, require("../test/fixtures/client/cryptoConfiguration.json"))
		.get("/api/peers")
		.reply(200, require("../test/fixtures/client/peers.json"))
		.get("/api/node/syncing")
		.reply(200, require("../test/fixtures/client/syncing.json"))
		.get("/api/wallets/D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW")
		.reply(200, require("../test/fixtures/client/wallet-non-resigned.json"))
		.persist();
});

test.before.each(async () => {
	profile = new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" });

	await importByMnemonic(profile, identity.mnemonic, "ARK", "ark.devnet");

	subject = new RegistrationAggregate(profile);
});

test("#delegates", async () => {
	const delegates = subject.delegates();

	assert.length(delegates, 1);
	assert.is(delegates[0].address(), "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
});

test.run();
