import { assert, test } from "@payvo/sdk-test";

import { cloneObject } from "./clone-object";

	test("should work like lodash", () => {
		const objects = { a: 1 };

		assert.equal(cloneObject(objects), objects);
	});
