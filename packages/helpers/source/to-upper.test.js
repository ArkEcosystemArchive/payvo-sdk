import { describe } from "@payvo/sdk-test";

import { toUpper } from "./to-upper";

describe("toUpper", async ({ assert, it }) => {
	it("should turn everything into upper case", () => {
		assert.is(toUpper("--foo-bar--"), "--FOO-BAR--");
		assert.is(toUpper("fooBar"), "FOOBAR");
		assert.is(toUpper("__foo_bar__"), "__FOO_BAR__");
	});
});
