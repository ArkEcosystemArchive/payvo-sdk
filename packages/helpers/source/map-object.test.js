import { assert, test } from "@payvo/sdk-test";

import { mapObject } from "./map-object";

test("should work like lodash", () => {
	assert.equal(
		mapObject({ a: 4, b: 8 }, (n) => n * n),
		[16, 64],
	);
});

test.run();
