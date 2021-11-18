import { assert, test } from "@payvo/sdk-test";

import { words } from "./words";

test("should work with words", () => {
	assert.equal(words("fred, barney, & pebbles"), ["fred", "barney", "pebbles"]);
});

test.run();
