import { isNumber } from "./is-number";

test("#isNumber", () => {
	test("should pass", () => {
		assert.is(isNumber(1), true);
	});

	test("should fail", () => {
		assert.is(isNumber("1"), false);
	});
});
