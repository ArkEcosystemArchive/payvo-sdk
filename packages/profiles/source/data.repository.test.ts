import "reflect-metadata";

import { DataRepository } from "./data.repository";

let subject: DataRepository;

beforeEach(() => (subject = new DataRepository()));

test("#all", () => {
    subject.set("key1", "value1");
    subject.set("key2", "value2");

    assert.is(subject.all()).toMatchInlineSnapshot(`
		Object {
		  "key1": "value1",
		  "key2": "value2",
		}
	`);
});

test("#first", () => {
    subject.set("key1", "value1");
    subject.set("key2", "value2");

    assert.is(subject.first(), "value1");
});

test("#last", () => {
    subject.set("key1", "value1");
    subject.set("key2", "value2");

    assert.is(subject.last(), "value2");
});

test("#keys", () => {
    subject.set("key1", "value1");
    subject.set("key2", "value2");

    assert.is(subject.keys()).toMatchInlineSnapshot(`
		Array [
		  "key1",
		  "key2",
		]
	`);
});

test("#values", () => {
    subject.set("key1", "value1");
    subject.set("key2", "value2");

    assert.is(subject.values()).toMatchInlineSnapshot(`
		Array [
		  "value1",
		  "value2",
		]
	`);
});

test("#get | #set | #has | #missing", () => {
    assert.is(subject.get("key")), "undefined");
assert.is(subject.has("key"), false);
assert.is(subject.missing("key"), true);

subject.set("key", "value");

assert.is(subject.get("key"), "value");
assert.is(subject.has("key"), true);
assert.is(subject.missing("key"), false);
});

test("#fill", () => {
    subject.set("key", "value");

    assert.is(subject.get("key"), "value");
    assert.is(subject.has("key"), true);
    assert.is(subject.missing("key"), false);

    subject.flush();

    assert.is(subject.get("key")), "undefined");
assert.is(subject.has("key"), false);
assert.is(subject.missing("key"), true);
});

test("#forget", () => {
    subject.set("key", "value");

    assert.is(subject.get("key"), "value");
    assert.is(subject.has("key"), true);
    assert.is(subject.missing("key"), false);

    subject.forget("key");

    assert.is(subject.get("key")), "undefined");
assert.is(subject.has("key"), false);
assert.is(subject.missing("key"), true);
});

test("#forgetIndex", () => {
    subject.set("key", [1, 2, 3]);

    assert.is(subject.get("key")).toEqual([1, 2, 3]);

    subject.forgetIndex("key", 1);

    assert.is(subject.get("key")).toEqual([1, 3]);

    subject.forgetIndex("key", 10);

    assert.is(subject.get("key")).toEqual([1, 3]);

    subject.forgetIndex("xkey", 10);

    assert.is(subject.get("xkey")), "undefined");
});

test("#flush", () => {
    subject.set("key", "value");

    assert.is(subject.get("key"), "value");
    assert.is(subject.has("key"), true);
    assert.is(subject.missing("key"), false);

    subject.flush();

    assert.is(subject.get("key")), "undefined");
assert.is(subject.has("key"), false);
assert.is(subject.missing("key"), true);
});

test("#count", () => {
    subject.set("key", "value");

    assert.is(subject.count(), 1);

    subject.flush();

    assert.is(subject.count(), 0);
});

test("#snapshot | #restore", () => {
    subject.set("key", "value");

    assert.is(subject.count(), 1);

    subject.snapshot();
    subject.flush();

    assert.is(subject.count(), 0);

    subject.restore();

    assert.is(subject.count(), 1);

    assert.is(() => subject.restore()).toThrow("There is no snapshot to restore.");
});

test("#toJSON", () => {
    subject.set("key", "value");

    assert.is(subject.toJSON()).toMatchInlineSnapshot(`"{\\"key\\":\\"value\\"}"`);
});
