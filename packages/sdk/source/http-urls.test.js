import { assert, test } from "@payvo/sdk-test";
import { ensureTrailingSlash } from "./urls";

test("#ensureTrailingSlash", () => {
	assert.is(ensureTrailingSlash("#"), "#/");
	assert.is(ensureTrailingSlash("/"), "/");
});
