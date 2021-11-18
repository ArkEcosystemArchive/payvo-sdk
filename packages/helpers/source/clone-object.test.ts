import { cloneObject } from "./clone-object.js";

describe("#cloneObject", () => {
	it("should work like lodash", () => {
		const objects = { a: 1 };

		assert.is(cloneObject(objects), objects);
	});
});
