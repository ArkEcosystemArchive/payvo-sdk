import { describe } from "@payvo/sdk-test";

import { pull } from "./pull";

describe("pull", async ({ assert, it }) => {
	it("should work with a property", () => {
		assert.equal(pull(["a", "b", "c", "a", "b", "c"], "a", "c"), ["b", "b"]);
	});
});
