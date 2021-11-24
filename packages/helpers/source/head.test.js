import { describe } from "@payvo/sdk-test";

import { head } from "./head";

describe("head", async ({ assert, it }) => {
	it("should return the first item", () => {
		assert.is(head([1, 2, 3, 4, 5]), 1);
	});
});
