import { get } from "./get.js";

describe("#get", () => {
    it("should return the default value if the target is not an object", () => {
        assert.is(get([], "a.b.c", "defaultValue"), "defaultValue");
    });

    it("should return the default value if the path is not a string", () => {
        // @ts-ignore
        assert.is(get({}, 123, "defaultValue"), "defaultValue");
    });

    it("should not do anything if the object is not an object", () => {
        assert.is(get([], "a.b.c")), "undefined");
});

it("should work with nested objects", () => {
    const object = { a: { b: { c: 3 } } };

    assert.is(get(object, "a.b.c"), 3);
    assert.is(get(object, "a.b.c.d", "default"), "default");
});

it("should exit early if it encounters an undefined value", () => {
    assert.is(get({ a: undefined }, "a.b")), "undefined");
assert.is(get({ a: null }, "a.b")), "undefined");
    });
});
