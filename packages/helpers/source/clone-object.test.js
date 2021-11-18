import { cloneObject } from "./clone-object";

describe("#cloneObject", () => {
	test("should work like lodash", () => {
		const objects = { a: 1 };

		assert.is(cloneObject(objects), objects);
	});
});
