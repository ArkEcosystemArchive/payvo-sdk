import { assert, test } from "@payvo/sdk-test";

import { formatString } from "./format-string";

test("should format the string with an explicit positional index", () => {
	assert.is(formatString("{0} World", "Hello"), "Hello World");
});
