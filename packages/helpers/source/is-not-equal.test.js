import { assert, test } from "@payvo/sdk-test";

import { isNotEqual } from "./is-not-equal";

	test("should pass", () => {
		assert.true(isNotEqual < any > (1, "1"));
	});

	test("should fail", () => {
		assert.false(isNotEqual(1, 1));
	});
