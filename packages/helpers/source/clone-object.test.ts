import { describe } from "@payvo/sdk-test";

import { cloneObject } from "./clone-object";

describe("cloneObject", async ({ assert, it, nock, loader }) => {
	it("should work like lodash", () => {
		const objects = { a: 1 };

		assert.equal(cloneObject(objects), objects);
	});
});
