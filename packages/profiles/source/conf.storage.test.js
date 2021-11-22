import { assert, describe, stub, loader, test } from "@payvo/sdk-test";
import { UUID } from "@payvo/sdk-cryptography";

import { ConfStorage as ConfigStorage } from "./conf.storage";

let subject;
let key;

test.before.each(() => {
	subject = new ConfigStorage();
	key = UUID.random();
});

test("ConfStorage#all", async () => {
	assert.object(await subject.all(), {});

	await subject.set(key, "value");

	assert.object(await subject.all(), { [key]: "value" });

	await subject.flush();

	assert.object(await subject.all(), {});
});

test("ConfStorage#get", async () => {
	await subject.set(key, "value");

	assert.is(await subject.get(key), "value");
});

test("ConfStorage#set", async () => {
	assert.undefined(await subject.set(key, "value"));
});

test("ConfStorage#has", async () => {
	assert.false(await subject.has(key));

	await subject.set(key, "value");

	assert.true(await subject.has(key));
});

test("ConfStorage#forget", async () => {
	assert.false(await subject.has(key));

	await subject.set(key, "value");

	assert.true(await subject.has(key));

	await subject.forget(key);

	assert.false(await subject.has(key));
});

test("ConfStorage#flush", async () => {
	assert.false(await subject.has(key));

	await subject.set(key, "value");

	assert.true(await subject.has(key));

	await subject.flush();

	assert.false(await subject.has(key));
});

test("ConfStorage#count", async () => {
	assert.is(await subject.count(), 0);

	await subject.set(key, "value");

	assert.is(await subject.count(), 1);

	await subject.forget(key);

	assert.is(await subject.count(), 0);
});

test("ConfStorage#snapshot", async () => {
	assert.undefined(await subject.snapshot());
});

test("ConfStorage#restore", async () => {
	assert.undefined(await subject.restore());
});

test.run();
