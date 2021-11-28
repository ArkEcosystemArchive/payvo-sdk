import { describe } from "@payvo/sdk-test";
import "reflect-metadata";
import { bootContainer } from "../test/mocking";

import { ProfileSetting, WalletSetting } from "./contracts";
import { Profile } from "./profile";

import { SettingRepository } from "./setting.repository";

describe("SettingRepository", ({
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	loader,
	nock,
	assert,
	test,
	stub,
	it,
}) => {
	beforeAll(() => {
		bootContainer();
	});

	for (const type of ["profile", "wallet"]) {
		let subject;
		let key;

		beforeEach(() => {
			subject = new SettingRepository(
				new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }),
				Object.values(type === "profile" ? ProfileSetting : WalletSetting),
			);
			subject.flush();

			key = type === "profile" ? ProfileSetting.Locale : WalletSetting.Peer;
		});

		it("#all", async () => {
			assert.equal(subject.all(), {});

			subject.set(key, "value");

			assert.equal(subject.all(), { [key]: "value" });
			assert.equal(subject.keys(), [key]);

			subject.flush();

			assert.equal(subject.all(), {});
			assert.equal(subject.keys(), []);
		});

		it("#get", async () => {
			subject.set(key, "value");

			assert.is(subject.get(key), "value");
		});

		it("#set", async () => {
			assert.undefined(subject.set(key, "value"));
		});

		it("#has", async () => {
			assert.false(subject.has(key));

			subject.set(key, "value");

			assert.true(subject.has(key));
		});

		it("#missing", async () => {
			assert.true(subject.missing(key));

			subject.set(key, "value");

			assert.false(subject.missing(key));
		});

		it("#forget", async () => {
			assert.false(subject.has(key));

			subject.set(key, "value");

			assert.true(subject.has(key));

			subject.forget(key);

			assert.false(subject.has(key));
		});

		it("#flush", async () => {
			assert.false(subject.has(key));

			subject.set(key, "value");

			assert.true(subject.has(key));

			subject.flush();

			assert.false(subject.has(key));
		});
	}
});