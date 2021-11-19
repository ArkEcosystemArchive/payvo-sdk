import { assert, test } from "@payvo/sdk-test";
import { AttributeBag } from "./attribute-bag";

const values = { a: "a", b: "b", c: "c" };

let subject;

test.before.each(() => (subject = new AttributeBag()));

test("#all", async () => {
	subject.setMany(values);

	assert.is(subject.all(), values);
});

test("#get", async () => {
	assert.is(subject.get("a", "defaultValue"), "defaultValue");

	subject.set("a", "a");

	assert.is(subject.get("a"), "a");
});

test("#set", async () => {
	subject.set("a", "a");

	assert.true(subject.has("a"));
});

test("#has", async () => {
	assert.false(subject.has("a"));

	subject.set("a", "a");

	assert.true(subject.has("a"));
});

test("#hasStrict", async () => {
	subject.set("a", undefined);

	assert.false(subject.hasStrict("a"));

	subject.set("a", "a");

	assert.true(subject.hasStrict("a"));
});

test("#missing", async () => {
	assert.true(subject.missing("a"));

	subject.set("a", "a");

	assert.false(subject.missing("a"));
});

test("#forget", async () => {
	subject.set("a", "a");

	assert.true(subject.has("a"));

	subject.forget("a");

	assert.true(subject.missing("a"));
});

test("#flush", async () => {
	subject.set("a", "a");

	assert.true(subject.has("a"));

	subject.flush();

	assert.true(subject.missing("a"));
});

test("#only", async () => {
	subject.setMany(values);

	assert.is(subject.only(["a", "b"]), { a: "a", b: "b" });
});

test("#except", async () => {
	subject.setMany(values);

	assert.is(subject.except(["a", "b"]), { c: "c" });
});

test.run();
