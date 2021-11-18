import { isBigInt } from "./is-bigint";

	test("should pass", () => {
		assert.true(isBigInt(BigInt(1)));
	});

	test("should fail", () => {
		assert.false(isBigInt("1"));
		assert.false(isBigInt(1));
	});
