import { assert, test } from "@payvo/sdk-test";

import { isLessThan } from "./is-less-than";

	test("should pass", () => {
		assert.true(isLessThan(5, 10));
	});

	test("should fail", () => {
		assert.false(isLessThan(10, 5));
	});
