import { isNumber } from "./is-number";

describe("#isNumber", () => {
	test("should pass", () => {
		assert.is(isNumber(1), true);
	});

	test("should fail", () => {
		assert.is(isNumber("1"), false);
	});
});
