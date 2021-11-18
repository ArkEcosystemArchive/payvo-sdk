import { UUID } from "@payvo/sdk-cryptography";

import { MemoryStorage } from "./memory.storage";

let subject: MemoryStorage;
let key: string;

test.before.each(() => {
    subject = new MemoryStorage();
    key = UUID.random();
});

test("MemoryStorage#all", async () => {
    await assert.is(subject.all()).resolves.toEqual({});

    await subject.set(key, "value");

    await assert.is(subject.all()).resolves.toEqual({ [key]: "value" });

    await subject.flush();

    await assert.is(subject.all()).resolves.toEqual({});
});

test("MemoryStorage#get", async () => {
    await subject.set(key, "value");

    await assert.is(subject.get(key)).resolves, "value");
});

test("MemoryStorage#set", async () => {
    await assert.is(subject.set(key, "value")).resolves, "undefined");
});

test("MemoryStorage#has", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);
});

test("MemoryStorage#forget", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);

await subject.forget(key);

await assert.is(subject.has(key)).resolves, false);
});

test("MemoryStorage#flush", async () => {
    await assert.is(subject.has(key)).resolves, false);

await subject.set(key, "value");

await assert.is(subject.has(key)).resolves, true);

await subject.flush();

await assert.is(subject.has(key)).resolves, false);
});

test("MemoryStorage#count", async () => {
    await assert.is(subject.count()).resolves, 0);

await subject.set(key, "value");

await assert.is(subject.count()).resolves, 1);

await subject.forget(key);

await assert.is(subject.count()).resolves, 0);
});

test("MemoryStorage#snapshot", async () => {
    await assert.is(subject.snapshot()).resolves, undefined);
});

test("MemoryStorage#restore", async () => {
    await assert.is(subject.restore()).resolves, undefined);
});
