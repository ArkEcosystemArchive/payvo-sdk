import { describe } from "@payvo/sdk-test";

import { ensureTrailingSlash } from "./http-urls.js";

describe("HTTP URLs", ({ assert, it, nock, loader }) => {
	it("should ensure a trailing slash is set", () => {
		assert.is(ensureTrailingSlash("#"), "#/");
		assert.is(ensureTrailingSlash("/"), "/");
	});
});
