import { describe } from "@payvo/sdk-test";

import { Collection } from "./collection";

let collection;

describe("Collection", async ({ assert, beforeEach, it }) => {
	beforeEach(() => {
		collection = new Collection();
		collection.set("key", "value");
	});

	it("should return the underlying collection", () => {
		assert.equal(collection.all(), { key: "value" });
	});

	it("should return all entries", () => {
		assert.equal(collection.entries(), [["key", "value"]]);
	});

	it("should return all keys", () => {
		assert.equal(collection.keys(), ["key"]);
	});

	it("should return all values", () => {
		assert.equal(collection.values(), ["value"]);
	});

	it("should get an item and remove it", () => {
		assert.is(collection.pull("key"), "value");

		assert.true(collection.isEmpty());
	});

	it("should get an item", () => {
		assert.is(collection.get("key"), "value");
	});
	it("should set an item", () => {
		assert.true(collection.has("key"));
	});

	it("should forget an item", () => {
		assert.false(collection.isEmpty());

		collection.forget("key");

		assert.true(collection.isEmpty());
	});

	it("should flush all items", () => {
		assert.false(collection.isEmpty());

		collection.flush();

		assert.true(collection.isEmpty());
	});

	it("has", () => {
		it("should return true if an item exists", () => {
			assert.true(collection.has("key"));
		});

		it("should return false if an item doesn't exist", () => {
			collection.flush();

			assert.false(collection.has("key"));
		});
	});

	it("missing", () => {
		it("should return false if an item isn't missing", () => {
			assert.false(collection.missing("key"));
		});

		it("should return true if an item is missing", () => {
			collection.flush();

			assert.true(collection.missing("key"));
		});
	});

	it("should count all items", () => {
		assert.is(collection.count(), 1);
	});

	it("isEmpty", () => {
		it("should return false if there are items", () => {
			assert.false(collection.isEmpty());
		});

		it("should return true if there are no items", () => {
			collection.flush();

			assert.true(collection.isEmpty());
		});
	});

	it("isNotEmpty", () => {
		it("should return true if there are items", () => {
			assert.true(collection.isNotEmpty());
		});

		it("should return false if there are no items", () => {
			collection.flush();

			assert.false(collection.isNotEmpty());
		});
	});

	it("should return a random item", () => {
		assert.is(collection.random(), "value");
	});

	it("should turn the items into JSON", () => {
		assert.is(collection.toJson(), JSON.stringify({ ["key"]: "value" }));
	});
});
