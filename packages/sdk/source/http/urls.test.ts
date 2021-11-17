import { ensureTrailingSlash } from "./urls.js";

test("#ensureTrailingSlash", () => {
	expect(ensureTrailingSlash("#")).toBe("#/");
	expect(ensureTrailingSlash("/")).toBe("/");
});
