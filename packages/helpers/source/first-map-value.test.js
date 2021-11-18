import { assert, test } from "@payvo/sdk-test";

import { firstMapValue } from "./first-map-value";

	test("should return the first value", () => {
		assert.is(firstMapValue(new Map([["Hello", "World"]])), "World");
	});
