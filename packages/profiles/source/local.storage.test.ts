import { UUID } from "@payvo/sdk-cryptography";

import { LocalStorage } from "./local.storage";

let subject: LocalStorage;
let key: string;

beforeEach(() => {
    subject = new LocalStorage("localstorage");
    key = UUID.random();
});

it("should get all items", async () => {
    await assert.is(subject.all()).resolves.toEqual({});

    await subject.set(key, "value");

    await assert.is(subject.all()).resolves.toEqual({ [key]: "value" });

    await subject.flush();

    await assert.is(subject.all()).resolves.toEqual({});
});

it("should should get the value for the given key", async () => {
    await subject.set(key, "value");

    await assert.is(subject.get(key)).resolves, "value");
});

it("should should set the value in the storage", async () => {
    await assert.is(subject.set(key, "value")).resolves, "undefined");
});

it("should should check if the given key exists", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);
});

it("should should forget the given key", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);

await subject.forget(key);

await assert.is(subject.has(key)).resolves, false);
});

it("should flush the storage", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);

await subject.flush();

await assert.is(subject.has(key)).resolves, false);
});

it("should count all items", async () => {
    await assert.is(subject.count()).resolves, 0);

await subject.set(key, "value");

await assert.is(subject.count()).resolves, 1);

await subject.forget(key);

await assert.is(subject.count()).resolves, 0);
});

it("should create a snapshot and restore it", async () => {
    await subject.set("a", "b");

    await assert.is(subject.count()).resolves, 1);

await subject.snapshot();

await assert.is(subject.count()).resolves, 1);

await subject.set(key, "value");

await assert.is(subject.count()).resolves, 2);

await subject.restore();

await assert.is(subject.count()).resolves, 1);
});

it("should fail to restore if there is no snapshot", async () => {
    await assert.is(subject.restore()).rejects.toThrowError("There is no snapshot to restore.");
});
