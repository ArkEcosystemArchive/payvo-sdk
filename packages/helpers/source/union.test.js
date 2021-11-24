import { describe } from "@payvo/sdk-test";

import { union } from "./union";

describe("union", async ({ assert, it }) => {
	it("should work with any value", () => {
		assert.equal(union([2], [1, 2]), [2, 1]);
	});
});
