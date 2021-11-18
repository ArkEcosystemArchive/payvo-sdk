import { mapArray } from "./map-array";

test("#mapArray", () => {
	test("should work like lodash", () => {
		assert.is(
			mapArray([4, 8], (n) => n * n),
			[16, 64],
		);
	});
});
