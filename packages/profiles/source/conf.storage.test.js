import { UUID } from "@payvo/sdk-cryptography";

import { ConfStorage as ConfigStorage } from "./conf.storage";

let subject: ConfigStorage;
let key: string;

test.before.each(() => {
    subject = new ConfigStorage();
    key = UUID.random();
});

test("ConfStorage#all", async () => {
    await assert.is(subject.all()).resolves.toEqual({});

    await subject.set(key, "value");

    await assert.is(subject.all()).resolves.toEqual({ [key]: "value" });

    await subject.flush();

    await assert.is(subject.all()).resolves.toEqual({});
});

test("ConfStorage#get", async () => {
    await subject.set(key, "value");

    await assert.is(subject.get(key)).resolves, "value");
});

test("ConfStorage#set", async () => {
    await assert.is(subject.set(key, "value")).resolves, "undefined");
});

test("ConfStorage#has", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);
});

test("ConfStorage#forget", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);

await subject.forget(key);

await assert.is(subject.has(key)).resolves, false);
});

test("ConfStorage#flush", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);

await subject.flush();

await assert.is(subject.has(key)).resolves, false);
});

test("ConfStorage#count", async () => {
    await assert.is(subject.count()).resolves, 0);

await subject.set(key, "value");

await assert.is(subject.count()).resolves, 1);

await subject.forget(key);

await assert.is(subject.count()).resolves, 0);
});

test("ConfStorage#snapshot", async () => {
    await assert.is(subject.snapshot()).resolves, undefined);
});

test("ConfStorage#restore", async () => {
    await assert.is(subject.restore()).resolves, undefined);
});
