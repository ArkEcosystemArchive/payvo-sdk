import { describe } from "@payvo/sdk-test";

import { mapArray } from "./map-array";

describe("mapArray", async ({ assert, it }) => {
	it("should work like lodash", () => {
		assert.equal(
			mapArray([4, 8], (n) => n * n),
			[16, 64],
		);
	});
});
