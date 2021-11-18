import { ensureTrailingSlash } from "./urls.js";

test("#ensureTrailingSlash", () => {
	assert.is(ensureTrailingSlash("#"), "#/");
	assert.is(ensureTrailingSlash("/"), "/");
});
