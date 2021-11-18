import { mapArray } from "./map-array.js";

describe("#mapArray", () => {
	it("should work like lodash", () => {
		assert.is(mapArray([4, 8], (n) => n * n)).toEqual([16, 64]);
	});
});
