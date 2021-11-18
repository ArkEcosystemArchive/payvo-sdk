import { assert, test } from "@payvo/sdk-test";

import { lastMapEntry } from "./last-map-entry";

test("should return the last entry", () => {
	assert.equal(
		lastMapEntry(
			new Map([
				["Hello", "World"],
				["Another", "Planet"],
			]),
		),
		["Another", "Planet"],
	);
});

test.run();
