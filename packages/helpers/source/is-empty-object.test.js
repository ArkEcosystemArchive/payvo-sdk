import { assert, test } from "@payvo/sdk-test";

import { isEmptyObject } from "./is-empty-object";

	test("should return true for an empty object", () => {
		assert.true(isEmptyObject({}));
});
