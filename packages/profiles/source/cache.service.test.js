import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import { Cache } from "./cache.service";

let subject;

test.before.each(() => (subject = new Cache("wallet-ABC")));

test("should return a list of all key-value pairs", async () => {
	assert.empty(subject.all());

	subject.set("key", "value", 1);

	assert.not.empty(subject.all());
});

test("should return a list of all keys", async () => {
	assert.empty(subject.keys());

	subject.set("key", "value", 1);

	assert.not.empty(subject.keys());
	assert.string(subject.keys()[0]);
});

test("should set, get and forget a value", async () => {
	assert.throws(() => subject.get("key"));
	assert.false(subject.has("key"));

	subject.set("key", "value", 1);

	assert.is(subject.get("key"), "value");
	assert.true(subject.has("key"));

	subject.forget("key");

	assert.throws(() => subject.get("key"));
	assert.false(subject.has("key"));
});

test("should flush the cache", async () => {
	assert.throws(() => subject.get("key"));
	assert.false(subject.has("key"));

	subject.set("key", "value", 1);

	assert.is(subject.get("key"), "value");
	assert.true(subject.has("key"));

	subject.flush();

	assert.throws(() => subject.get("key"));
	assert.false(subject.has("key"));
});

test.run();
