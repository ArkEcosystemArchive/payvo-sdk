import { uniqBy } from "./uniq-by.js";

describe("#uniqBy", () => {
	it("should work with a function", () => {
		expect(uniqBy([2.1, 1.2, 2.3], Math.floor)).toEqual([2.1, 1.2]);
	});
});
