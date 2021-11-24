import { describe } from "@payvo/sdk-test";

import { at } from "./at";

describe("at", async ({ assert, it }) => {
	it("should work like lodash", () => {
		const object = {
			a: { b: { c: 3 } },
			x: { y: { z: 4 } },
		};

		assert.equal(at(object, ["a.b.c", "x.y.z"]), [3, 4]);
	});
});
