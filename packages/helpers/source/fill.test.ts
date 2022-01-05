import { describe } from "@payvo/sdk-test";

import { fill } from "./fill";

describe("fill", async ({ assert, it, nock, loader }) => {
	it("should work with an array", () => {
		assert.equal(fill([1, 2, 3], "a"), ["a", "a", "a"]);
		assert.equal(fill(Array(3), 2), [2, 2, 2]);
		assert.equal(fill([4, 6, 8, 10], "*", 1, 3), [4, "*", "*", 10]);
	});
});
