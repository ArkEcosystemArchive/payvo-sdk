import { assert, test } from "@payvo/sdk-test";

import { hashString } from "./hash-string";

test("should return a number for the given string", function () {
	assert.is(hashString("Hello World"), 1661258373);
});

test.run();
