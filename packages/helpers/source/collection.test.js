import { assert, test } from "@payvo/sdk-test";

import { Collection } from "./collection";

let collection;

test.before.each(() => {
	collection = new Collection();
	collection.set("key", "value");
});

test("should return the underlying collection", () => {
	assert.is(collection.all(), { key: "value" });
});

test("should return all entries", () => {
	assert.is(collection.entries(), [["key", "value"]]);
});

test("should return all keys", () => {
	assert.is(collection.keys(), ["key"]);
});

test("should return all values", () => {
	assert.is(collection.values(), ["value"]);
});

test("should get an item and remove it", () => {
	assert.is(collection.pull("key"), "value");

	assert.true(collection.isEmpty());
});

test("should get an item", () => {
	assert.is(collection.get("key"), "value");
});
test("should set an item", () => {
	assert.true(collection.has("key"));
});

test("should forget an item", () => {
	assert.false(collection.isEmpty());

	collection.forget("key");

	assert.true(collection.isEmpty());
});

test("should flush all items", () => {
	assert.false(collection.isEmpty());

	collection.flush();

	assert.true(collection.isEmpty());
});

test("has", () => {
	test("should return true if an item exists", () => {
		assert.true(collection.has("key"));
	});

	test("should return false if an item doesn't exist", () => {
		collection.flush();

		assert.false(collection.has("key"));
	});
});

test("missing", () => {
	test("should return false if an item isn't missing", () => {
		assert.false(collection.missing("key"));
	});

	test("should return true if an item is missing", () => {
		collection.flush();

		assert.true(collection.missing("key"));
	});
});

test("should count all items", () => {
	assert.is(collection.count(), 1);
});

test("isEmpty", () => {
	test("should return false if there are items", () => {
		assert.false(collection.isEmpty());
	});

	test("should return true if there are no items", () => {
		collection.flush();

		assert.true(collection.isEmpty());
	});
});

test("isNotEmpty", () => {
	test("should return true if there are items", () => {
		assert.true(collection.isNotEmpty());
	});

	test("should return false if there are no items", () => {
		collection.flush();

		assert.false(collection.isNotEmpty());
	});
});

test("should return a random item", () => {
	assert.is(collection.random(), "value");
});

test("should turn the items into JSON", () => {
	assert.is(collection.toJson(), JSON.stringify({ ["key"]: "value" }));
});

test.run();
