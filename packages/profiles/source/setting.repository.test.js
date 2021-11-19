import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";
import { bootContainer } from "../test/mocking";

import { ProfileSetting, WalletSetting } from "./contracts";
import { Profile } from "./profile";

import { SettingRepository } from "./setting.repository";

test.before(() => {
	bootContainer();
});

// describe.each([["profile", "wallet"]])("SettingRepository(%s)", (type) => {
// 	let subject;
// 	let key;

// 	test.before.each(() => {
// 		subject = new SettingRepository(
// 			new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }),
// 			Object.values(type === "profile" ? ProfileSetting : WalletSetting),
// 		);
// 		subject.flush();

// 		key = type === "profile" ? ProfileSetting.Locale : WalletSetting.Peer;
// 	});

// 	test("#all", async () => {
// 		assert.is(subject.all(), {});

// 		subject.set(key, "value");

// 		assert.is(subject.all(), { [key]: "value" });
// 		assert.is(subject.keys(), [key]);

// 		subject.flush();

// 		assert.is(subject.all(), {});
// 		assert.is(subject.keys(), []);
// 	});

// 	test("#get", async () => {
// 		subject.set(key, "value");

// 		assert.is(subject.get(key), "value");
// 	});

// 	test("#set", async () => {
// 		assert.undefined(subject.set(key, "value"));
// 	});

// 	test("#has", async () => {
// 		assert.false(subject.has(key));

// 		subject.set(key, "value");

// 		assert.true(subject.has(key));
// 	});

// 	test("#missing", async () => {
// 		assert.true(subject.missing(key));

// 		subject.set(key, "value");

// 		assert.false(subject.missing(key));
// 	});

// 	test("#forget", async () => {
// 		assert.false(subject.has(key));

// 		subject.set(key, "value");

// 		assert.true(subject.has(key));

// 		subject.forget(key);

// 		assert.false(subject.has(key));
// 	});

// 	test("#flush", async () => {
// 		assert.false(subject.has(key));

// 		subject.set(key, "value");

// 		assert.true(subject.has(key));

// 		subject.flush();

// 		assert.false(subject.has(key));
// 	});
// });

test.run();
