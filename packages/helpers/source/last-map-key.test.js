import { assert, test } from "@payvo/sdk-test";

import { lastMapKey } from "./last-map-key";

test("should return the last key", () => {
	assert.is(
		lastMapKey(
			new Map([
				["Hello", "World"],
				["Another", "Planet"],
			]),
		),
		"Another",
	);
});

test.run();
