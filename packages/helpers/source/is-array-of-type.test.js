import { isArrayOfType } from "./is-array-of-type";

describe("#isArrayOfType", () => {
	test("should pass", () => {
		assert.is(isArrayOfType<number>([1], "number"), true);
	});

	test("should fail", () => {
		assert.is(isArrayOfType<number>(["string"], "number"), false);
	});
});
