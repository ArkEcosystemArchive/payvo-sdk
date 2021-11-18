import { sample } from "./sample";

test("should return a random item", () => {
	assert.number(sample([1, 2, 3, 4, 5]));
});
