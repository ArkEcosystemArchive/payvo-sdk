import { set } from "./set.js";

describe("#set", () => {
	it("should not do anything if the target is not an object", () => {
		assert.is(set(undefined, "a.b.c", 4), false);
	});

	it("should work with a string or array as path", () => {
		const object = { a: { b: { c: 3 } } };

		set(object, "a.b.c", 4);

		assert.is(object.a.b.c, 4);

		set(object, "x.y.z", 5);

		// @ts-ignore
		assert.is(object.x.y.z, 5);
	});
});
