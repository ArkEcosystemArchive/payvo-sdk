import { toUpper } from "./to-upper.js";

describe("#toUpper", () => {
	it("should turn everything into upper case", () => {
		assert.is(toUpper("--foo-bar--")).toEqual("--FOO-BAR--");
		assert.is(toUpper("fooBar")).toEqual("FOOBAR");
		assert.is(toUpper("__foo_bar__")).toEqual("__FOO_BAR__");
	});
});
