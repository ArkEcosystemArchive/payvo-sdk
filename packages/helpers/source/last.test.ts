import { last } from "./last.js";

describe("#last", () => {
	it("should return the last item", () => {
		expect(last([1, 2, 3, 4, 5])).toBe(5);
	});
});
