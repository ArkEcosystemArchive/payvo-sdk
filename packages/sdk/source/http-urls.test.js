import { ensureTrailingSlash } from "./urls";

test("#ensureTrailingSlash", () => {
	assert.is(ensureTrailingSlash("#"), "#/");
	assert.is(ensureTrailingSlash("/"), "/");
});
