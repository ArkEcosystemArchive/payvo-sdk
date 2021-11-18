import { isArrayOfType } from "./is-array-of-type";

test("#isArrayOfType", () => {
	test("should pass", () => {
		assert.is(isArrayOfType < number > ([1], "number"), true);
	});

	test("should fail", () => {
		assert.is(isArrayOfType < number > (["string"], "number"), false);
	});
});
