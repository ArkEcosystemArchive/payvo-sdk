import { trimTrailingSlash } from "./trim-trailing-slash";

test("#trimTrailingSlash", () => {
	test("should remove all trailing slashes", () => {
		assert.is(trimTrailingSlash("/owner/path"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path/"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path//"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path//"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path///"), "/owner/path");
	});
});
