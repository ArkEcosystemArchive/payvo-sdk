import { describe } from "@payvo/sdk-test";

import { isBigInt } from "./is-bigint";

describe("isBigInt", async ({ assert, it }) => {
	it("should pass", () => {
		assert.true(isBigInt(BigInt(1)));
	});

	it("should fail", () => {
		assert.false(isBigInt("1"));
		assert.false(isBigInt(1));
	});
});
