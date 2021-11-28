import { describe } from "@payvo/sdk-test";

import { reverse } from "./reverse";

describe("reverse", async ({ assert, it, nock, loader }) => {
	it("should work with a string", () => {
		assert.is(reverse("abc"), "cba");
	});
});
