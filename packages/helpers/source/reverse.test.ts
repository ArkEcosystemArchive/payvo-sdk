import { reverse } from "./reverse.js";

describe("#reverse", () => {
	it("should work with a string", () => {
		assert.is(reverse("abc")).toEqual("cba");
	});
});
