import { assert, test } from "@payvo/sdk-test";

import { reduce } from "./reduce";

test("should work with an array", () => {
	assert.is(
		reduce([1, 2], (sum, n) => sum + n, 0),
		3,
	);
});

test("should work with an object", () => {
	assert.equal(
		reduce(
			{ a: 1, b: 2, c: 1 },
			(result, value, key) => {
				(result[value] || (result[value] = [])).push(key);

				return result;
			},
			{},
		),
		{ 1: ["a", "c"], 2: ["b"] },
	);
});

test.run();