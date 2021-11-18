import { mapObject } from "./map-object";

test("#mapObject", () => {
	test("should work like lodash", () => {
		assert.is(
			mapObject({ a: 4, b: 8 }, (n) => n * n),
			[16, 64],
		);
	});
});
