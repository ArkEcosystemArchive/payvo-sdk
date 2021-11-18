import { getType } from "./get-type";

describe("#getType", () => {
	test("should return the type of the given value", () => {
		assert.is(getType([]), "[object Array]");
		assert.is(getType(1), "[object Number]");
		assert.is(getType({}), "[object Object]");
		assert.is(getType("hello"), "[object String]");
	});
});
