import { assert, test } from "@payvo/sdk-test";

import { at } from "./at";

test("#at", () => {
	test("should work like lodash", () => {
		const object = {
			a: { b: { c: 3 } },
			x: { y: { z: 4 } },
		};

		assert.is(at(object, ["a.b.c", "x.y.z"]), [3, 4]);
	});
});
