import { head } from "./head";

describe("#head", () => {
	test("should return the first item", () => {
		assert.is(head([1, 2, 3, 4, 5]), 1);
	});
});
