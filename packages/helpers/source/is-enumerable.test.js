import { isEnumerable } from "./is-enumerable";

const object1 = {};
const array1 = [];
// @ts-ignore
object1.property1 = 42;
// @ts-ignore
array1[0] = 42;

test("should work with objects and arrays", () => {
	assert.true(isEnumerable(object1, "property1"));
	assert.true(isEnumerable(array1, 0));
	assert.false(isEnumerable(array1, "length"));
});
