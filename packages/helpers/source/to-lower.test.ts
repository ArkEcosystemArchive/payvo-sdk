import { toLower } from "./to-lower.js";

describe("#toLower", () => {
	it("should turn everything into lower case", () => {
		assert.is(toLower("--foo-bar--")).toEqual("--foo-bar--");
		assert.is(toLower("fooBar")).toEqual("foobar");
		assert.is(toLower("__foo_bar__")).toEqual("__foo_bar__");
	});
});
