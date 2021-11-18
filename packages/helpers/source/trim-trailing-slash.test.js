import { trimTrailingSlash } from "./trim-trailing-slash";

describe("#trimTrailingSlash", () => {
	test("should remove all trailing slashes", () => {
		assert.is(trimTrailingSlash("/owner/path"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path/"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path//"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path//"), "/owner/path");
		assert.is(trimTrailingSlash("/owner/path///"), "/owner/path");
	});
});
