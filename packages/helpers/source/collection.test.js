import { describe } from "@payvo/sdk-test";

import { Collection } from "./collection";

describe("Collection", async ({ assert, beforeEach, it }) => {
	beforeEach((context) => {
		context.collection = new Collection();
		context.collection.set("key", "value");
	});

	it("should return the underlying collection", (context) => {
		assert.equal(context.collection.all(), { key: "value" });
	});

	it("should return all entries", (context) => {
		assert.equal(context.collection.entries(), [["key", "value"]]);
	});

	it("should return all keys", (context) => {
		assert.equal(context.collection.keys(), ["key"]);
	});

	it("should return all values", (context) => {
		assert.equal(context.collection.values(), ["value"]);
	});

	it("should get an item and remove it", (context) => {
		assert.is(context.collection.pull("key"), "value");

		assert.true(context.collection.isEmpty());
	});

	it("should get an item", (context) => {
		assert.is(context.collection.get("key"), "value");
	});
	it("should set an item", (context) => {
		assert.true(context.collection.has("key"));
	});

	it("should forget an item", (context) => {
		assert.false(context.collection.isEmpty());

		context.collection.forget("key");

		assert.true(context.collection.isEmpty());
	});

	it("should flush all items", (context) => {
		assert.false(context.collection.isEmpty());

		context.collection.flush();

		assert.true(context.collection.isEmpty());
	});

	it("has", () => {
		it("should return true if an item exists", (context) => {
			assert.true(context.collection.has("key"));
		});

		it("should return false if an item doesn't exist", () => {
			context.collection.flush();

			assert.false(context.collection.has("key"));
		});
	});

	it("missing", () => {
		it("should return false if an item isn't missing", (context) => {
			assert.false(context.collection.missing("key"));
		});

		it("should return true if an item is missing", (context) => {
			context.collection.flush();

			assert.true(context.collection.missing("key"));
		});
	});

	it("should count all items", (context) => {
		assert.is(context.collection.count(), 1);
	});

	it("isEmpty", () => {
		it("should return false if there are items", (context) => {
			assert.false(context.collection.isEmpty());
		});

		it("should return true if there are no items", (context) => {
			context.collection.flush();

			assert.true(collection.isEmpty());
		});
	});

	it("isNotEmpty", () => {
		it("should return true if there are items", (context) => {
			assert.true(context.collection.isNotEmpty());
		});

		it("should return false if there are no items", (context) => {
			context.collection.flush();

			assert.false(context.collection.isNotEmpty());
		});
	});

	it("should return a random item", (context) => {
		assert.is(context.collection.random(), "value");
	});

	it("should turn the items into JSON", (context) => {
		assert.is(context.collection.toJson(), JSON.stringify({ ["key"]: "value" }));
	});
});
