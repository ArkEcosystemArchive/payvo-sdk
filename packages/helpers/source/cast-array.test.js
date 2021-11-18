import { assert, test } from "@payvo/sdk-test";

import { castArray } from "./cast-array";

test("should work with any value", () => {
	assert.equal(castArray(1), [1]);
	assert.equal(castArray([1]), [1]);
	assert.equal(castArray({ a: 1 }), [{ a: 1 }]);
	assert.equal(castArray("abc"), ["abc"]);
	assert.equal(castArray(null), []);
	assert.equal(castArray(undefined), []);
	assert.equal(castArray(new Map([["key", "value"]]).keys()), ["key"]);
});
