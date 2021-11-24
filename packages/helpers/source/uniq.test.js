import { describe } from "@payvo/sdk-test";

import { uniq } from "./uniq";

describe("uniq", async ({ assert, it }) => {
	it("should remove duplicate items", () => {
		assert.equal(uniq([2, 1, 2]), [2, 1]);
	});
});
