import { NullStorage } from "./null.storage";

let subject: NullStorage;

beforeEach(() => (subject = new NullStorage()));

test("#all", async () => {
    await assert.is(subject.all()).resolves.toEqual({});
});

test("#get", async () => {
    await assert.is(subject.get("key")).resolves, "undefined");
});

test("#set", async () => {
    await assert.is(subject.set("key", "value")).resolves, "undefined");
});

test("#has", async () => {
    await assert.is(subject.has("key")).resolves, false);
});

test("#forget", async () => {
    await assert.is(subject.forget("null")).resolves, "undefined");
});

test("#flush", async () => {
    await assert.is(subject.flush()).resolves, "undefined");
});

test("#count", async () => {
    await assert.is(subject.count()).resolves, 0);
});

test("#snapshot", async () => {
    await assert.is(subject.snapshot()).resolves, "undefined");
});

test("#restore", async () => {
    await assert.is(subject.restore()).resolves, "undefined");
});
