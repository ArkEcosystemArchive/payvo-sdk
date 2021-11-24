import { describe } from "@payvo/sdk-test";

import { isWeakMap } from "./is-weak-map";

describe("isWeakMap", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isWeakMap(new WeakMap()));
	});

	it("should fail", () => {
		assert.false(isWeakMap(1));
	});
});
