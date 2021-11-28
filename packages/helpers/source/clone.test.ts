import { describe } from "@payvo/sdk-test";

import { clone } from "./clone";

describe("clone", async ({ assert, it, nock, loader }) => {
	it("should work with an array", () => {
		const objects = [{ a: 1 }, { b: 2 }];

		assert.equal(clone(objects), objects);
	});

	it("should work with an object", () => {
		const objects = { a: 1 };

		assert.equal(clone(objects), objects);
	});
});
