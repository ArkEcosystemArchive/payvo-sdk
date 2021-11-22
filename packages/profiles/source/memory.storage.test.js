import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import { UUID } from "@payvo/sdk-cryptography";

import { MemoryStorage } from "./memory.storage";

let subject;
let key;

test.before.each(() => {
	subject = new MemoryStorage();
	key = UUID.random();
});

test("MemoryStorage#all", async () => {
	assert.equal(await subject.all(), {});

	await subject.set(key, "value");

	assert.equal(await subject.all(), { [key]: "value" });

	await subject.flush();

	assert.equal(await subject.all(), {});
});

test("MemoryStorage#get", async () => {
	await subject.set(key, "value");

	assert.is(await subject.get(key), "value");
});

test("MemoryStorage#set", async () => {
	assert.undefined(await subject.set(key, "value"));
});

test("MemoryStorage#has", async () => {
	assert.is(await subject.has(key), false);

	await subject.set(key, "value");

	assert.true(await subject.has(key));
});

test("MemoryStorage#forget", async () => {
	assert.is(await subject.has(key), false);

	await subject.set(key, "value");

	assert.true(await subject.has(key));

	await subject.forget(key);

	assert.is(await subject.has(key), false);
});

test("MemoryStorage#flush", async () => {
	assert.is(await subject.has(key), false);

	await subject.set(key, "value");

	assert.true(await subject.has(key));

	await subject.flush();

	assert.is(await subject.has(key), false);
});

test("MemoryStorage#count", async () => {
	assert.is(await subject.count(), 0);

	await subject.set(key, "value");

	assert.is(await subject.count(), 1);

	await subject.forget(key);

	assert.is(await subject.count(), 0);
});

test("MemoryStorage#snapshot", async () => {
	assert.undefined(await subject.snapshot());
});

test("MemoryStorage#restore", async () => {
	assert.undefined(await subject.restore());
});

test.run();
