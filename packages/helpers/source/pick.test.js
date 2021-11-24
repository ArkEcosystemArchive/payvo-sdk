import { describe } from "@payvo/sdk-test";

import { pick } from "./pick";

describe("pick", async ({ assert, it }) => {
	it("should return an object with only the given properties", () => {
		assert.equal(pick({ a: 1, b: "2", c: 3 }, ["a", "c"]), { a: 1, c: 3 });
	});
});
