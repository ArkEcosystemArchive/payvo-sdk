import { assert, test } from "@payvo/sdk-test";

import { sample } from "./sample";

test("should return a random item", () => {
	assert.number(sample([1, 2, 3, 4, 5]));
});

test.run();
