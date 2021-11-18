import { Cache } from "./cache.service";

let subject: Cache;
test.before.each(() => (subject = new Cache("wallet-ABC")));

test("should return a list of all key-value pairs", async () => {
    assert.is(subject.all()).toBeEmpty();

    subject.set("key", "value", 1);

    assert.is(subject.all()).not.toBeEmpty();
});

test("should return a list of all keys", async () => {
    assert.is(subject.keys()).toBeEmpty();

    subject.set("key", "value", 1);

    assert.is(subject.keys()).not.toBeEmpty();
    assert.is(subject.keys()[0]), "string");
});

test("should set, get and forget a value", async () => {
    assert.is(() => subject.get("key")).toThrow();
    assert.is(subject.has("key"), false);

    subject.set("key", "value", 1);

    assert.is(subject.get("key"), "value");
    assert.is(subject.has("key"), true);

    subject.forget("key");

    assert.is(() => subject.get("key")).toThrow();
    assert.is(subject.has("key"), false);
});

test("should flush the cache", async () => {
    assert.is(() => subject.get("key")).toThrow();
    assert.is(subject.has("key"), false);

    subject.set("key", "value", 1);

    assert.is(subject.get("key"), "value");
    assert.is(subject.has("key"), true);

    subject.flush();

    assert.is(() => subject.get("key")).toThrow();
    assert.is(subject.has("key"), false);
});
