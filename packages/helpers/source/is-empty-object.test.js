import { isEmptyObject } from "./is-empty-object";

describe("#isEmptyObject", () => {
	test("should return true for an empty object", () => {
		assert.is(isEmptyObject({}), true);
	});
});
