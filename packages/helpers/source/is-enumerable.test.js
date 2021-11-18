import { isEnumerable } from "./is-enumerable";

const object1 = {};
const array1 = [];
// @ts-ignore
object1.property1 = 42;
// @ts-ignore
array1[0] = 42;

describe("#isEnumerable", () => {
	it("should work with objects and arrays", () => {
		assert.is(isEnumerable(object1, "property1"), true);
		assert.is(isEnumerable(array1, 0), true);
		assert.is(isEnumerable(array1, "length"), false);
	});
});
