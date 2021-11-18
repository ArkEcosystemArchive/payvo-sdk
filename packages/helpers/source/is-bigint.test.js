import { isBigInt } from "./is-bigint";

describe("#isBigInt", () => {
	it("should pass", () => {
		assert.is(isBigInt(BigInt(1)), true);
	});

	it("should fail", () => {
		assert.is(isBigInt("1"), false);
		assert.is(isBigInt(1), false);
	});
});
