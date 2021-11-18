import { assert, test } from "@payvo/sdk-test";

import { reverse } from "./reverse";

	test("should work with a string", () => {
		assert.is(reverse("abc"), "cba");
	});
