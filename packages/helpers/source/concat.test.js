import { describe } from "@payvo/sdk-test";

import { concat } from "./concat";

describe("concat", async ({ assert, it }) => {
	it("should concatenate all values", () => {
		assert.equal(concat([1], 2, [3], [[4]]), [1, 2, 3, [4]]);
	});
});
