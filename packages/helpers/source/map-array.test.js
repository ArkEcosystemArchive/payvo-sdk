import { assert, test } from "@payvo/sdk-test";

import { mapArray } from "./map-array";

test("should work like lodash", () => {
	assert.equal(
		mapArray([4, 8], (n) => n * n),
		[16, 64],
	);
});

test.run();
