import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import "reflect-metadata";

import { DataRepository } from "./data.repository";

let subject;

test.before.each(() => (subject = new DataRepository()));

test("#all", () => {
	subject.set("key1", "value1");
	subject.set("key2", "value2");

	assert.equal(subject.all(), {
		key1: "value1",
		key2: "value2",
	});
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

	assert.equal(subject.keys(), ["key1", "key2"]);
});

test("#values", () => {
	subject.set("key1", "value1");
	subject.set("key2", "value2");

	assert.equal(subject.values(), ["value1", "value2"]);
});

test("#get | #set | #has | #missing", () => {
	assert.undefined(subject.get("key"));
	assert.false(subject.has("key"));
	assert.true(subject.missing("key"));

	subject.set("key", "value");

	assert.is(subject.get("key"), "value");
	assert.true(subject.has("key"));
	assert.false(subject.missing("key"));
});

test("#fill", () => {
	subject.set("key", "value");

	assert.is(subject.get("key"), "value");
	assert.true(subject.has("key"));
	assert.false(subject.missing("key"));

	subject.flush();

	assert.undefined(subject.get("key"));
	assert.false(subject.has("key"));
	assert.true(subject.missing("key"));
});

test("#forget", () => {
	subject.set("key", "value");

	assert.is(subject.get("key"), "value");
	assert.true(subject.has("key"));
	assert.false(subject.missing("key"));

	subject.forget("key");

	assert.undefined(subject.get("key"));
	assert.false(subject.has("key"));
	assert.true(subject.missing("key"));
});

test("#forgetIndex", () => {
	subject.set("key", [1, 2, 3]);

	assert.equal(subject.get("key"), [1, 2, 3]);

	subject.forgetIndex("key", 1);

	assert.equal(subject.get("key"), [1, 3]);

	subject.forgetIndex("key", 10);

	assert.equal(subject.get("key"), [1, 3]);

	subject.forgetIndex("xkey", 10);

	assert.undefined(subject.get("xkey"));
});

test("#flush", () => {
	subject.set("key", "value");

	assert.is(subject.get("key"), "value");
	assert.true(subject.has("key"));
	assert.false(subject.missing("key"));

	subject.flush();

	assert.undefined(subject.get("key"));
	assert.false(subject.has("key"));
	assert.true(subject.missing("key"));
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

	assert.throws(() => subject.restore(), "There is no snapshot to restore.");
});

test("#toJSON", () => {
	subject.set("key", "value");

	assert.string(subject.toJSON());
});

test.run();
