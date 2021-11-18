import { last } from "./last";

test("#last", () => {
	test("should return the last item", () => {
		assert.is(last([1, 2, 3, 4, 5]), 5);
	});
});
