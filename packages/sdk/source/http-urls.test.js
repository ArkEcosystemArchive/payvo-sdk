import { assert, test } from "@payvo/sdk-test";
import { ensureTrailingSlash } from "./http-urls";

test("#ensureTrailingSlash", () => {
	assert.is(ensureTrailingSlash("#"), "#/");
	assert.is(ensureTrailingSlash("/"), "/");
});

test.run();
