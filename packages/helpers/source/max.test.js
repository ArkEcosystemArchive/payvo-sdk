import { describe } from "@payvo/sdk-test";

import { max } from "./max";

describe("max", async ({ assert, it }) => {
	it("should return the largest number", () => {
		assert.is(max([1, 2, 3, 4, 5]), 5);
	});
});
