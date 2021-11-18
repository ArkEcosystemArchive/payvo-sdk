import "reflect-metadata";
import { bootContainer } from "../test/mocking.js";

import { ProfileSetting, WalletSetting } from "./contracts.js";
import { Profile } from "./profile.js";

import { SettingRepository } from "./setting.repository";

beforeAll(() => {
    bootContainer();
});

describe.each([["profile", "wallet"]])("SettingRepository(%s)", (type) => {
    let subject: SettingRepository;
    let key: string;

    test.before.each(() => {
        subject = new SettingRepository(
            new Profile({ id: "uuid", name: "name", avatar: "avatar", data: "" }),
            Object.values(type === "profile" ? ProfileSetting : WalletSetting),
        );
        subject.flush();

        key = type === "profile" ? ProfileSetting.Locale : WalletSetting.Peer;
    });

    test("#all", async () => {
        assert.is(subject.all(), {});

        subject.set(key, "value");

        assert.is(subject.all(), { [key]: "value" });
        assert.is(subject.keys(), [key]);

        subject.flush();

        assert.is(subject.all(), {});
        assert.is(subject.keys(), []);
    });

    test("#get", async () => {
        subject.set(key, "value");

        assert.is(subject.get(key), "value");
    });

    test("#set", async () => {
        assert.is(subject.set(key, "value")), "undefined");
});

test("#has", async () => {
    assert.is(subject.has(key), false);

    subject.set(key, "value");

    assert.is(subject.has(key), true);
});

test("#missing", async () => {
    assert.is(subject.missing(key), true);

    subject.set(key, "value");

    assert.is(subject.missing(key), false);
});

test("#forget", async () => {
    assert.is(subject.has(key), false);

    subject.set(key, "value");

    assert.is(subject.has(key), true);

    subject.forget(key);

    assert.is(subject.has(key), false);
});

test("#flush", async () => {
    assert.is(subject.has(key), false);

    subject.set(key, "value");

    assert.is(subject.has(key), true);

    subject.flush();

    assert.is(subject.has(key), false);
});
});
