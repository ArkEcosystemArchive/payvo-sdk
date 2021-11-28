import { describe } from "@payvo/sdk-test";

import { isSymbol } from "./is-symbol";

describe("isSymbol", async ({ assert, it, nock, loader }) => {
	it("should pass", () => {
		assert.true(isSymbol(Symbol.for("string")));
	});

	it("should fail", () => {
		assert.false(isSymbol("string"));
	});
});
