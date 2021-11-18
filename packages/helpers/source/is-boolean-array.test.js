import { isBooleanArray } from "./is-boolean-array";

test("#isBooleanArray", () => {
	test("should pass", () => {
		assert.is(isBooleanArray([true]), true);
	});

	test("should fail", () => {
		assert.is(isBooleanArray([1]), false);
	});
});
