import { zipObject } from "./zip-object.js";

describe("#zipObject", () => {
	it("should create an object from the keys and values", () => {
		assert.is(zipObject(["a", "b"], [1, 2])).toEqual({ a: 1, b: 2 });
	});
});
