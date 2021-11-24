import { describe } from "@payvo/sdk-test";

import { mapObject } from "./map-object";

describe("mapObject", async ({ assert, it }) => {
	it("should work like lodash", () => {
		assert.equal(
			mapObject({ a: 4, b: 8 }, (n) => n * n),
			[16, 64],
		);
	});
});
