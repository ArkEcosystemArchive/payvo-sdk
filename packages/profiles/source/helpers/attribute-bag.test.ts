import { AttributeBag } from "./attribute-bag.js";

interface Attributes {
	a: string;
	b: string;
	c: string;
}

const values = { a: "a", b: "b", c: "c" };

let subject: AttributeBag<Attributes>;

test.before.each(() => (subject = new AttributeBag<Attributes>()));

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

	assert.is(subject.has("a"), true);
});

test("#has", async () => {
	assert.is(subject.has("a"), false);

	subject.set("a", "a");

	assert.is(subject.has("a"), true);
});

test("#hasStrict", async () => {
	subject.set("a", undefined);

	assert.is(subject.hasStrict("a"), false);

	subject.set("a", "a");

	assert.is(subject.hasStrict("a"), true);
});

test("#missing", async () => {
	assert.is(subject.missing("a"), true);

	subject.set("a", "a");

	assert.is(subject.missing("a"), false);
});

test("#forget", async () => {
	subject.set("a", "a");

	assert.is(subject.has("a"), true);

	subject.forget("a");

	assert.is(subject.missing("a"), true);
});

test("#flush", async () => {
	subject.set("a", "a");

	assert.is(subject.has("a"), true);

	subject.flush();

	assert.is(subject.missing("a"), true);
});

test("#only", async () => {
	subject.setMany(values);

	assert.is(subject.only(["a", "b"]), { a: "a", b: "b" });
});

test("#except", async () => {
	subject.setMany(values);

	assert.is(subject.except(["a", "b"]), { c: "c" });
});
