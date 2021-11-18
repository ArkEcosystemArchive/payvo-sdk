import { isArrayOfType } from "./is-array-of-type";

test("should pass", () => {
	assert.true(isArrayOfType<number>([1], "number"));
});

test("should fail", () => {
	assert.false(isArrayOfType<number>(["string"], "number"));
});
