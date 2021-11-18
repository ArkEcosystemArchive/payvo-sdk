import { at } from "./at";

describe("#at", () => {
	test("should work like lodash", () => {
		const object = {
			a: { b: { c: 3 } },
			x: { y: { z: 4 } },
		};

		assert.is(at(object, ["a.b.c", "x.y.z"]), [3, 4]);
	});
});
