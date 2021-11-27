import { describe } from "@payvo/sdk-test";

import { formatString } from "./format-string";

describe("formatString", async ({ assert, it, nock, loader }) => {
	it("should format the string with an explicit positional index", () => {
		assert.is(formatString("{0} World", "Hello"), "Hello World");
	});
});
