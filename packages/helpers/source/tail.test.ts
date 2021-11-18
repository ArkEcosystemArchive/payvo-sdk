import { tail } from "./tail.js";

describe("#tail", () => {
	it("should return the array without the first item", () => {
		assert.is(tail([1, 2, 3, 4, 5]), [2, 3, 4, 5]);
	});
});
