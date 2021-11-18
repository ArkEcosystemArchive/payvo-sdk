import { assert, test } from "@payvo/sdk-test";

import { isAsyncFunction } from "./is-async-function";

	test("should pass", () => {
		assert.true(
			isAsyncFunction(async () => ({})),
		);
	});

	test("should fail", () => {
		assert.false(isAsyncFunction(new Function()));
		assert.false(isAsyncFunction([]));
	});
