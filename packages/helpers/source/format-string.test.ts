import { formatString } from "./format-string.js";

describe("#formatString", () => {
	it("should format the string with an explicit positional index", () => {
		assert.is(formatString("{0} World", "Hello"), "Hello World");
	});
});
