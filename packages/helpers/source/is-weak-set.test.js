import { assert, test } from "@payvo/sdk-test";

import { isWeakSet } from "./is-weak-set";

	test("should pass", () => {
		assert.true(isWeakSet(new WeakSet()));
	});

	test("should fail", () => {
		assert.false(isWeakSet(1));
	});
