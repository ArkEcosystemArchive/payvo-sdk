import { tail } from "./tail";

test("#tail", () => {
	test("should return the array without the first item", () => {
		assert.is(tail([1, 2, 3, 4, 5]), [2, 3, 4, 5]);
	});
