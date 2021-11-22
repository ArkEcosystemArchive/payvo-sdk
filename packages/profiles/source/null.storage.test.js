import { assert, describe, mockery, loader, test } from "@payvo/sdk-test";
import { NullStorage } from "./null.storage";

let subject;

test.before.each(() => (subject = new NullStorage()));

test("#all", async () => {
	assert.equal(await subject.all(), {});
});

test("#get", async () => {
	assert.undefined(await subject.get("key"));
});

test("#set", async () => {
	assert.undefined(await subject.set("key", "value"));
});

test("#has", async () => {
	assert.false(await subject.has("key"));
});

test("#forget", async () => {
	assert.undefined(await subject.forget("null"));
});

test("#flush", async () => {
	assert.undefined(await subject.flush());
});

test("#count", async () => {
	assert.is(await subject.count(), 0);
});

test("#snapshot", async () => {
	assert.undefined(await subject.snapshot());
});

test("#restore", async () => {
	assert.undefined(await subject.restore());
});

test.run();
