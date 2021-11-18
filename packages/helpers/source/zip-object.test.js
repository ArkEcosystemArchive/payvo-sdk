import { assert, test } from "@payvo/sdk-test";

import { zipObject } from "./zip-object";

test("#zipObject", () => {
	test("should create an object from the keys and values", () => {
		assert.equal(zipObject(["a", "b"], [1, 2]), { a: 1, b: 2 });
	});
});
