import { describe } from "@payvo/sdk-test";

import { reverse } from "./reverse";

describe("reverse", async ({ assert, it }) => {
	it("should work with a string", () => {
		assert.is(reverse("abc"), "cba");
	});
});
