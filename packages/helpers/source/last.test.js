import { assert, test } from "@payvo/sdk-test";

import { last } from "./last";

test("should return the last item", () => {
	assert.is(last([1, 2, 3, 4, 5]), 5);
});

test.run();
