import { assert, test } from "@payvo/sdk-test";

import { isMap } from "./is-map";

	test("should pass", () => {
		assert.true(isMap(new Map()));
	});

	test("should fail", () => {
		assert.false(isMap(1));
	});
