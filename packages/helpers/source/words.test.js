import { describe } from "@payvo/sdk-test";

import { words } from "./words";

describe("words", async ({ assert, it }) => {
	it("should work with words", () => {
		assert.equal(words("fred, barney, & pebbles"), ["fred", "barney", "pebbles"]);
	});
});
