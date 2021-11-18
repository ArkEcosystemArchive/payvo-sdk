import { castArray } from "./cast-array";

describe("#castArray", () => {
	test("should work with any value", () => {
		assert.is(castArray(1), [1]);
		assert.is(castArray([1]), [1]);
		assert.is(castArray({ a: 1 }), [{ a: 1 }]);
		assert.is(castArray("abc"), ["abc"]);
		assert.is(castArray(null), []);
		assert.is(castArray(undefined), []);
		assert.is(castArray(new Map([["key", "value"]]).keys()), ["key"]);
	});
});
