import { at } from "./at.js";

describe("#at", () => {
	it("should work like lodash", () => {
		const object = {
			a: { b: { c: 3 } },
			x: { y: { z: 4 } },
		};

		assert.is(at(object, ["a.b.c", "x.y.z"])).toEqual([3, 4]);
	});
});
