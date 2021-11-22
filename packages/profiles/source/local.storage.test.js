import { assert, test } from "@payvo/sdk-test";
import { UUID } from "@payvo/sdk-cryptography";

import { LocalStorage } from "./local.storage";

let subject;
let key;

test.before.each(() => {
	subject = new LocalStorage("localstorage");
	key = UUID.random();
});

test.skip("should get all items", async () => {
	assert.equal(await subject.all(), {});

	await subject.set(key, "value");

	assert.equal(await subject.all(), { [key]: "value" });

	await subject.flush();

	assert.equal(await subject.all(), {});
});

test.skip("should should get the value for the given key", async () => {
	await subject.set(key, "value");

	assert.is(await subject.get(key), "value");
});

test.skip("should should set the value in the storage", async () => {
	assert.undefined(await subject.set(key, "value"));
});

test.skip("should should check if the given key exists", async () => {
	assert.false(await subject.has(key));

	await subject.set(key, "value");

	assert.true(await subject.has(key));
});

test.skip("should should forget the given key", async () => {
	assert.false(await subject.has(key));

	await subject.set(key, "value");

	assert.true(await subject.has(key));

	await subject.forget(key);

	assert.false(await subject.has(key));
});

test.skip("should flush the storage", async () => {
	assert.false(await subject.has(key));

	await subject.set(key, "value");

	assert.true(await subject.has(key));

	await subject.flush();

	assert.false(await subject.has(key));
});

test.skip("should count all items", async () => {
	assert.is(await subject.count(), 0);

	await subject.set(key, "value");

	assert.is(await subject.count(), 1);

	await subject.forget(key);

	assert.is(await subject.count(), 0);
});

test.skip("should create a snapshot and restore it", async () => {
	await subject.set("a", "b");

	assert.is(await subject.count(), 1);

	await subject.snapshot();

	assert.is(await subject.count(), 1);

	await subject.set(key, "value");

	assert.is(await subject.count(), 2);

	await subject.restore();

	assert.is(await subject.count(), 1);
});

test.skip("should fail to restore if there is no snapshot", async () => {
	await assert.rejects(() => subject.restore(), "There is no snapshot to restore.");
});

test.run();
