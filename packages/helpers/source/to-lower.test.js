import { toLower } from "./to-lower";

	test("should turn everything into lower case", () => {
		assert.is(toLower("--foo-bar--"), "--foo-bar--");
		assert.is(toLower("fooBar"), "foobar");
		assert.is(toLower("__foo_bar__"), "__foo_bar__");
	});
