import { zipObject } from "./zip-object";

describe("#zipObject", () => {
	test("should create an object from the keys and values", () => {
		assert.is(zipObject(["a", "b"], [1, 2]), { a: 1, b: 2 });
	});
});
