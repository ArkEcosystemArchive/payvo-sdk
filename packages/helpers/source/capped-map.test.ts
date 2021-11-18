import { CappedMap } from "./capped-map.js";

describe("Capped Map", () => {
    it("should set and get an entry", () => {
        const store = new CappedMap<string, number>(100);
        store.set("foo", 1);
        store.set("bar", 2);

        assert.is(store.get("foo"), 1);
        assert.is(store.count(), 2);
    });

    it("should get an entry", () => {
        const store = new CappedMap<string, number>(2);
        store.set("1", 1);
        store.set("2", 2);

        assert.is(store.get("1"), 1);
        assert.is(store.get("3")), "undefined");

    store.set("3", 3);

    assert.is(store.has("1"), false);
    assert.is(store.has("2"), true);
    assert.is(store.has("3"), true);
});

it("should set entries and remove ones that exceed the maximum size", () => {
    const store = new CappedMap<string, number>(2);
    store.set("foo", 1);
    store.set("bar", 2);

    assert.is(store.get("foo"), 1);
    assert.is(store.get("bar"), 2);

    store.set("baz", 3);
    store.set("faz", 4);

    assert.is(store.has("foo"), false);
    assert.is(store.has("bar"), false);
    assert.is(store.has("baz"), true);
    assert.is(store.has("faz"), true);
    assert.is(store.count(), 2);
});

it("should update an entry", () => {
    const store = new CappedMap<string, number>(100);
    store.set("foo", 1);

    assert.is(store.get("foo"), 1);

    store.set("foo", 2);

    assert.is(store.get("foo"), 2);
    assert.is(store.count(), 1);
});

it("should return if an entry exists", () => {
    const store = new CappedMap<string, number>(100);
    store.set("1", 1);

    assert.is(store.has("1"), true);
});

it("should remove the specified entrys", () => {
    const store = new CappedMap<string, number>(100);
    store.set("1", 1);
    store.set("2", 2);

    assert.is(store.delete("1"), true);
    assert.is(store.has("1"), false);
    assert.is(store.has("2"), true);
    assert.is(store.delete("1"), false);
    assert.is(store.count(), 1);
});

it("should remove the specified entrys", () => {
    const store = new CappedMap<string, number>(2);
    store.set("1", 1);
    store.set("2", 2);

    assert.is(store.count(), 2);
    assert.is(store.delete("1"), true);
    assert.is(store.has("1"), false);
    assert.is(store.has("2"), true);

    store.delete("2");

    assert.is(store.count(), 0);
});

it("should remove all entrys", () => {
    const store = new CappedMap<string, number>(3);
    store.set("1", 1);
    store.set("2", 2);
    store.set("3", 3);

    assert.is(store.count(), 3);

    store.clear();

    assert.is(store.count(), 0);
});

it("should return the first value", () => {
    const store = new CappedMap<string, number>(2);
    store.set("1", 1);
    store.set("2", 2);

    assert.is(store.first(), 1);
});

it("should return the last value", () => {
    const store = new CappedMap<string, number>(2);
    store.set("1", 1);
    store.set("2", 2);

    assert.is(store.last(), 2);
});

it("should return the keys", () => {
    const store = new CappedMap<string, number>(3);
    store.set("1", 1);
    store.set("2", 2);
    store.set("3", 3);

    assert.is(store.keys(), ["1", "2", "3"]);
});

it("should return the values", () => {
    const store = new CappedMap<string, number>(3);
    store.set("1", 1);
    store.set("2", 2);
    store.set("3", 3);

    assert.is(store.values(), [1, 2, 3]);
});

it("should return the entry count", () => {
    const store = new CappedMap<string, number>(100);
    store.set("1", 1);
    store.set("2", 2);

    assert.is(store.count(), 2);

    store.delete("1");

    assert.is(store.count(), 1);

    store.set("3", 3);

    assert.is(store.count(), 2);
});

it("should resize the map", () => {
    const store = new CappedMap<string, number>(3);
    store.set("1", 1);
    store.set("2", 2);
    store.set("3", 3);

    assert.is(store.count(), 3);

    store.resize(4);
    store.set("1", 1);
    store.set("2", 2);
    store.set("3", 3);
    store.set("4", 4);
    store.set("5", 5);

    assert.is(store.count(), 4);
    assert.is(store.has("1"), false);
    assert.is(store.has("2"), true);
    assert.is(store.has("3"), true);
    assert.is(store.has("4"), true);
    assert.is(store.has("5"), true);

    assert.is(store.count(), 4);

    store.resize(2);

    assert.is(store.count(), 2);
    assert.is(store.has("1"), false);
    assert.is(store.has("2"), false);
    assert.is(store.has("3"), false);
    assert.is(store.has("4"), true);
    assert.is(store.has("5"), true);
});
});
