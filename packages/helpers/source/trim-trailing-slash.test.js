import { assert, test } from "@payvo/sdk-test";

import { trimTrailingSlash } from "./trim-trailing-slash";

test("should remove all trailing slashes", () => {
	assert.is(trimTrailingSlash("/owner/path"), "/owner/path");
	assert.is(trimTrailingSlash("/owner/path/"), "/owner/path");
	assert.is(trimTrailingSlash("/owner/path//"), "/owner/path");
	assert.is(trimTrailingSlash("/owner/path//"), "/owner/path");
	assert.is(trimTrailingSlash("/owner/path///"), "/owner/path");
});

test.run();
