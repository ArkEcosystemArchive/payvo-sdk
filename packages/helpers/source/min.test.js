import { min } from "./min";

test("#min", () => {
	test("should return the smallest number", () => {
		assert.is(min([1, 0]), 0);
		assert.is(min([1, 2, 3, 4, 5]), 1);
	});
