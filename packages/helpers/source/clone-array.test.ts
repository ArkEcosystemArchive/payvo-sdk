import { cloneArray } from "./clone-array.js";

describe("#cloneArray", () => {
	it("should work like lodash", () => {
		const objects = [{ a: 1 }, { b: 2 }];

		assert.is(cloneArray(objects), objects);
	});
});
