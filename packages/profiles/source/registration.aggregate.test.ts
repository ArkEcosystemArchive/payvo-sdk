import "reflect-metadata";

import nock from "nock";

import { identity } from "../test/fixtures/identity.js";
import { bootContainer, importByMnemonic } from "../test/mocking.js";
import { IProfile } from "./contracts.js";
import { Profile } from "./profile.js";
import { RegistrationAggregate } from "./registration.aggregate";

let subject: RegistrationAggregate;
let profile: IProfile;

beforeAll(() => {
	bootContainer();

	nock(/.+/)
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

describe("RegistrationAggregate", () => {
	it("#delegates", async () => {
		const delegates = subject.delegates();

		assert.is(delegates).toHaveLength(1);
		assert.is(delegates[0].address(), "D6i8P5N44rFto6M6RALyUXLLs7Q1A1WREW");
	});
});
