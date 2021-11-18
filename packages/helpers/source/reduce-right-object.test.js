import { assert, test } from "@payvo/sdk-test";

import { reduceRightObject } from "./reduce-right-object";

	test("should work with a function", () => {
		assert
			.equal(
				reduceRightObject(
					{ a: 1, b: 2, c: 1 },
					(result, value, key) => {
						(result[value] || (result[value] = [])).push(key);

						return result;
					},
					{},
				), { 1: ["c", "a"], 2: ["b"] });
	});
