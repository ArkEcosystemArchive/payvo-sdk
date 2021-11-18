import { assert, test } from "@payvo/sdk-test";

import { Collection } from "./collection";

let collection;

test.before.each(() => {
	collection = new Collection();
	collection.set("key", "value");
});

test("Collection", () => {
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

		assert.is(collection.isEmpty(), true);
	});

	test("should get an item", () => {
		assert.is(collection.get("key"), "value");
	});
	test("should set an item", () => {
		assert.is(collection.has("key"), true);
	});

	test("should forget an item", () => {
		assert.is(collection.isEmpty(), false);

		collection.forget("key");

		assert.is(collection.isEmpty(), true);
	});

	test("should flush all items", () => {
		assert.is(collection.isEmpty(), false);

		collection.flush();

		assert.is(collection.isEmpty(), true);
	});

	test("has", () => {
		test("should return true if an item exists", () => {
			assert.is(collection.has("key"), true);
		});

		test("should return false if an item doesn't exist", () => {
			collection.flush();

			assert.is(collection.has("key"), false);
		});
	});

	test("missing", () => {
		test("should return false if an item isn't missing", () => {
			assert.is(collection.missing("key"), false);
		});

		test("should return true if an item is missing", () => {
			collection.flush();

			assert.is(collection.missing("key"), true);
		});
	});

	test("should count all items", () => {
		assert.is(collection.count(), 1);
	});

	test("isEmpty", () => {
		test("should return false if there are items", () => {
			assert.is(collection.isEmpty(), false);
		});

		test("should return true if there are no items", () => {
			collection.flush();

			assert.is(collection.isEmpty(), true);
		});
	});

	test("isNotEmpty", () => {
		test("should return true if there are items", () => {
			assert.is(collection.isNotEmpty(), true);
		});

		test("should return false if there are no items", () => {
			collection.flush();

			assert.is(collection.isNotEmpty(), false);
		});
	});

	test("should return a random item", () => {
		assert.is(collection.random(), "value");
	});

	test("should turn the items into JSON", () => {
		assert.is(collection.toJson(), JSON.stringify({ ["key"]: "value" }));
	});
