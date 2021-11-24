import { describe } from "@payvo/sdk-test";

import { isMap } from "./is-map";

describe("isMap", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isMap(new Map()));
	});

	it("should fail", () => {
		assert.false(isMap(1));
	});
});
