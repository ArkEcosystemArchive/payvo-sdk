import { describe } from "@payvo/sdk-test";

import { AttributeBag } from "./attribute-bag";

const values = { a: "a", b: "b", c: "c" };

let subject;

describe("AttributeBag", ({ beforeEach, it, assert }) => {
	beforeEach(() => (subject = new AttributeBag()));

	it("#all", async () => {
		subject.setMany(values);

		assert.equal(subject.all(), values);
	});

	it("#get", async () => {
		assert.is(subject.get("a", "defaultValue"), "defaultValue");

		subject.set("a", "a");

		assert.is(subject.get("a"), "a");
	});

	it("#set", async () => {
		subject.set("a", "a");

		assert.true(subject.has("a"));
	});

	it("#has", async () => {
		assert.false(subject.has("a"));

		subject.set("a", "a");

		assert.true(subject.has("a"));
	});

	it("#hasStrict", async () => {
		subject.set("a", undefined);

		assert.false(subject.hasStrict("a"));

		subject.set("a", "a");

		assert.true(subject.hasStrict("a"));
	});

	it("#missing", async () => {
		assert.true(subject.missing("a"));

		subject.set("a", "a");

		assert.false(subject.missing("a"));
	});

	it("#forget", async () => {
		subject.set("a", "a");

		assert.true(subject.has("a"));

		subject.forget("a");

		assert.true(subject.missing("a"));
	});

	it("#flush", async () => {
		subject.set("a", "a");

		assert.true(subject.has("a"));

		subject.flush();

		assert.true(subject.missing("a"));
	});

	it("#only", async () => {
		subject.setMany(values);

		assert.equal(subject.only(["a", "b"]), { a: "a", b: "b" });
	});

	it("#except", async () => {
		subject.setMany(values);

		assert.equal(subject.except(["a", "b"]), { c: "c" });
	});
});
