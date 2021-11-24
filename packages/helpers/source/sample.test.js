import { describe } from "@payvo/sdk-test";

import { sample } from "./sample";

describe("sample", async ({ assert, it }) => {
	it("should return a random item", () => {
		assert.number(sample([1, 2, 3, 4, 5]));
	});
});
