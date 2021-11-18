import { castArray } from "./cast-array.js";

describe("#castArray", () => {
	it("should work with any value", () => {
		assert.is(castArray(1)).toEqual([1]);
		assert.is(castArray([1])).toEqual([1]);
		assert.is(castArray({ a: 1 })).toEqual([{ a: 1 }]);
		assert.is(castArray("abc")).toEqual(["abc"]);
		assert.is(castArray(null)).toEqual([]);
		assert.is(castArray(undefined)).toEqual([]);
		assert.is(castArray(new Map([["key", "value"]]).keys())).toEqual(["key"]);
	});
});
