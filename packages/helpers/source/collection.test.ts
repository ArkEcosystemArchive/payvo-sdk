import { Collection } from "./collection.js";

let collection: Collection<string>;

test.before.each(() => {
	collection = new Collection<string>();
	collection.set("key", "value");
});

describe("Collection", () => {
	it("should return the underlying collection", () => {
		assert.is(collection.all(), { key: "value" });
	});

	it("should return all entries", () => {
		assert.is(collection.entries(), [["key", "value"]]);
	});

	it("should return all keys", () => {
		assert.is(collection.keys(), ["key"]);
	});

	it("should return all values", () => {
		assert.is(collection.values(), ["value"]);
	});

	it("should get an item and remove it", () => {
		assert.is(collection.pull("key"), "value");

		assert.is(collection.isEmpty(), true);
	});

	it("should get an item", () => {
		assert.is(collection.get("key"), "value");
	});
	it("should set an item", () => {
		assert.is(collection.has("key"), true);
	});

	it("should forget an item", () => {
		assert.is(collection.isEmpty(), false);

		collection.forget("key");

		assert.is(collection.isEmpty(), true);
	});

	it("should flush all items", () => {
		assert.is(collection.isEmpty(), false);

		collection.flush();

		assert.is(collection.isEmpty(), true);
	});

	describe("has", () => {
		it("should return true if an item exists", () => {
			assert.is(collection.has("key"), true);
		});

		it("should return false if an item doesn't exist", () => {
			collection.flush();

			assert.is(collection.has("key"), false);
		});
	});

	describe("missing", () => {
		it("should return false if an item isn't missing", () => {
			assert.is(collection.missing("key"), false);
		});

		it("should return true if an item is missing", () => {
			collection.flush();

			assert.is(collection.missing("key"), true);
		});
	});

	it("should count all items", () => {
		assert.is(collection.count(), 1);
	});

	describe("isEmpty", () => {
		it("should return false if there are items", () => {
			assert.is(collection.isEmpty(), false);
		});

		it("should return true if there are no items", () => {
			collection.flush();

			assert.is(collection.isEmpty(), true);
		});
	});

	describe("isNotEmpty", () => {
		it("should return true if there are items", () => {
			assert.is(collection.isNotEmpty(), true);
		});

		it("should return false if there are no items", () => {
			collection.flush();

			assert.is(collection.isNotEmpty(), false);
		});
	});

	it("should return a random item", () => {
		assert.is(collection.random(), "value");
	});

	it("should turn the items into JSON", () => {
		assert.is(collection.toJson(), JSON.stringify({ ["key"]: "value" }));
	});
});
