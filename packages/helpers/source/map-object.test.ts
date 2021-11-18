import { mapObject } from "./map-object.js";

describe("#mapObject", () => {
	it("should work like lodash", () => {
		assert.is(
			mapObject({ a: 4, b: 8 }, (n) => n * n),
			[16, 64],
		);
	});
});
