import { isEmptyObject } from "./is-empty-object.js";

describe("#isEmptyObject", () => {
	it("should return true for an empty object", () => {
		assert.is(isEmptyObject({}), true);
	});
});
